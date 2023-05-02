import crypto from "crypto";
import QrCode from "qrcode";
import { Inject, Service } from "typedi";
import { ClientSession } from "mongoose";
import C from "../constants";
import config from "../config";
import { UserService } from "./user.service";
import { TwoFaService } from "./two-fa.service";
import { IUser } from "../database/types/user.type";
import { IAuthTokenPayload } from "../interfaces";
import { EmailService } from "./external/email.service";
import {
  LoginDto,
  LoginResponse,
  RegisterUserDto,
  ResetPasswordDto,
  VerifyTwoFaDto,
  VerifyTwoFaResponse,
} from "../models";
import { AuthTokenType } from "../constants/auth-token-type.const";
import { BadRequestError, UnauthenticatedError } from "../exceptions";
import {
  CountryManager,
  DbTransactionHelper,
  JwtHelper,
  Logger,
  RateLimitManager,
  TotpAuthenticator,
} from "../helpers";
import { PasswordResetService } from "./password-reset.service";
import { SessionService } from "./session.service";

@Service()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly twoFaService: TwoFaService,
    @Inject() private readonly emailService: EmailService,
    @Inject() private readonly sessionService: SessionService,
    @Inject() private readonly passwordResetService: PasswordResetService,
  ) {}

  /**
   * @method register
   * @async
   * @param {RegisterUserDto} data
   * @returns {Promise<void>}
   */
  async register(data: RegisterUserDto): Promise<void> {
    data.email = data.email.toLowerCase();
    data.countryCode = data.countryCode.toUpperCase();

    if (!CountryManager.getNameByCode(data.countryCode)) {
      throw new BadRequestError("Invalid country!");
    }

    await this.userService.checkThatUserWithEmailDoesNotExist(data.email);

    await DbTransactionHelper.execute(async (dbSession?: ClientSession) => {
      const USER = await this.userService.createUser(data, dbSession);
      await this.twoFaService.create(USER._id.toUUIDString(), dbSession);
    });
  }

  /**
   * @method login
   * @async
   * @param {LoginDto} data
   * @returns {Promise<LoginResponse>}
   */
  async login(data: LoginDto): Promise<LoginResponse> {
    data.email = data.email.toLowerCase();

    const USER = await this.checkThatUserExistByEmailForLogin(data.email);
    let response: LoginResponse = { isPasswordless: true };

    if (data.password) {
      response = await this.handleTwoFaLogin(USER, data as Required<LoginDto>);
    } else {
      this.handlePasswordlessLogin(USER);
    }

    return response;
  }

  /**
   * @method sendPasswordResetLink
   * @async
   * @param {string} email
   * @returns {Promise<void>}
   */
  async sendPasswordResetLink(email: string): Promise<void> {
    email = email.toLowerCase();

    const USER = await this.userService.getUserByEmail(email);
    if (!USER) {
      return;
    }

    const RESET_TOKEN = crypto.randomBytes(30).toString("base64");

    /** TOTAL OF (36+1+40+1=78%3=0), SO THERE'S NO PADDING OF `=` or `==` AT THE END */
    const ENCODED_RESET_TOKEN =
      crypto.randomBytes(6).toString("base64") + // RANDOM UNUSED TOKEN (8 chars)
      Buffer.from(`${USER._id.toUUIDString()}@${RESET_TOKEN}I`).toString("base64");

    // console.debug("RESET_TOKEN", RESET_TOKEN.length, RESET_TOKEN);
    // console.debug("ENCODED_RESET_TOKEN", ENCODED_RESET_TOKEN);

    await this.passwordResetService.saveToken(USER._id.toUUIDString(), RESET_TOKEN);
    const RESET_LINK = `${config.WEB_APP_URL}?token=${encodeURIComponent(ENCODED_RESET_TOKEN)}`;

    // TODO: HANDLE EMAIL ERROR
    this.emailService.sendPasswordResetLink(
      USER.email,
      RESET_LINK,
      USER.firstName || USER.lastName,
    );
  }

  /**
   * @method resetPassword
   * @async
   * @param {ResetPasswordDto} data
   * @returns {Promise<void>}
   */
  async resetPassword(data: ResetPasswordDto): Promise<void> {
    await this.passwordResetService.checkThatUserResetTokenIsValid(data.userId, data.token);
    await this.userService.updatePassword(data.userId, data.password);

    RateLimitManager.reset(data.userId, C.ApiRateLimiterType.RESET_PASSWORD).catch();

    this.passwordResetService.deleteUserToken(data.userId).catch(Logger.error);
  }

  /**
   * @method verifyTwoFa
   * @async
   * @param {string} userId
   * @param {VerifyTwoFaDto} data
   * @returns {Promise<VerifyTwoFaResponse>}
   */
  async verifyTwoFa(userId: string, data: VerifyTwoFaDto): Promise<VerifyTwoFaResponse> {
    await this.twoFaService.verify(userId, data.code);

    const USER = await this.userService.checkThatUserExist(userId);
    const AUTH_TOKEN_PAYLOAD = this.generateUserAuthTokenPayload(USER);

    const AUTH_TOKEN = JwtHelper.generateToken(AUTH_TOKEN_PAYLOAD, config.AUTH_TOKEN_TTL_IN_HOURS);

    RateLimitManager.reset(userId, C.ApiRateLimiterType.VERIFY_2FA).catch();
    await this.sessionService.registerSession(userId, AUTH_TOKEN_PAYLOAD.sessionId);

    Logger.info(`User <${userId}> logged in successfully. Session=${AUTH_TOKEN_PAYLOAD.sessionId}`);

    return { user: USER.toJSON(), token: AUTH_TOKEN };
  }

  private async handleTwoFaLogin(user: IUser, data: Required<LoginDto>): Promise<LoginResponse> {
    // TODO: ADD DESCRIPTION
    this.userService.checkThatPasswordsMatch(data.password, user.password as string);
    const AUTH_TOKEN_PAYLOAD = this.generateUserAuthTokenPayload(user, C.AuthTokenType.VERIFY_2FA);

    const AUTH_TOKEN = JwtHelper.generateToken(
      AUTH_TOKEN_PAYLOAD,
      config.AUTH_2FA_TOKEN_TTL_IN_MILLISECS,
    );

    const TWO_FA_SECRET = await this.twoFaService.getTwoFaSecretIfNotSetup(user._id.toUUIDString());

    const twoFaSetupCode =
      TWO_FA_SECRET &&
      (await QrCode.toDataURL(TotpAuthenticator.getQrCode(TWO_FA_SECRET, data.email)));

    RateLimitManager.reset(user.email, C.ApiRateLimiterType.AUTH_LOGIN).catch();

    return { user, token: AUTH_TOKEN, twoFaSetupCode } as LoginResponse;
  }

  private async handlePasswordlessLogin(user: IUser): Promise<void> {
    // TODO: ADD DESCRIPTION
    const AUTH_TOKEN_PAYLOAD = this.generateUserAuthTokenPayload(user);
    let authToken = JwtHelper.generateToken(AUTH_TOKEN_PAYLOAD, config.AUTH_TOKEN_TTL_IN_HOURS);

    authToken =
      authToken.substring(0, authToken.length - 10) +
      crypto.randomUUID().substr(0, 8) +
      authToken.substring(authToken.length - 10);

    console.debug(authToken); // TODO: TO BE REMOVED
    const LOGIN_LINK = `${config.WEB_APP_URL}?code=${authToken}`;

    RateLimitManager.reset(user.email, C.ApiRateLimiterType.AUTH_LOGIN).catch();
    await this.sessionService.registerSession(user._id.toString(), AUTH_TOKEN_PAYLOAD.sessionId);

    Logger.info(
      `User <${user._id.toString()}> logged in successfully. Session=${
        AUTH_TOKEN_PAYLOAD.sessionId
      }`,
    );

    this.emailService.sendPasswordlessLoginLink(
      user.email,
      LOGIN_LINK,
      user.firstName || user.lastName,
    );
  }

  /**
   * @method checkThatUserExistByEmailForLogin
   * @async
   * @param {string} email
   * @returns {Promise<IUser>}
   */
  private async checkThatUserExistByEmailForLogin(email: string): Promise<IUser> {
    const foundUser = await this.userService.getUserByEmail(email);

    if (foundUser) {
      return foundUser;
    }

    throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
  }

  /**
   * @method generateUserAuthTokenPayload
   * @instance
   * @param {IUser} user
   * @param {AuthTokenType} tokenType
   * @returns {IAuthTokenPayload}
   */
  private generateUserAuthTokenPayload(user: IUser, tokenType?: AuthTokenType): IAuthTokenPayload {
    return {
      userId: user._id.toUUIDString(),
      isAdmin: user.isAdmin,
      type: tokenType,
      sessionId: crypto.randomUUID().replace(/-/g, "") + crypto.randomBytes(4).toString("hex"),
    };
  }
}
