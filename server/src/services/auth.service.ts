import crypto from "crypto";
import QrCode from "qrcode";
import { Inject, Service } from "typedi";
import { ClientSession } from "mongoose";
import { UserService } from "./user.service";
import C from "../constants";
import config from "../config";
import { TwoFaService } from "./two-fa.service";
import { IUser } from "../database/types/user.type";
import { IAuthTokenPayload } from "../interfaces";
import { BadRequestError, UnauthenticatedError } from "../exceptions";
import { CountryManager, DbTransactionHelper, JwtHelper, TotpAuthenticator } from "../helpers";
import { LoginDto, LoginResponse, RegisterUserDto } from "../models";
import { AuthTokenType } from "../constants/auth-token-type.const";
import { EmailService } from "./external/email.service";

@Service()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly twoFaService: TwoFaService,
    @Inject() private readonly emailService: EmailService,
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
      await this.twoFaService.create(USER._id, dbSession);
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

  private async handleTwoFaLogin(user: IUser, data: Required<LoginDto>): Promise<LoginResponse> {
    // TODO: ADD DESCRIPTION
    this.userService.checkThatPasswordsMatch(data.password, user.password as string);
    const AUTH_TOKEN_PAYLOAD = this.generateUserAuthTokenPayload(user, C.AuthTokenType.VERIFY_2FA);

    const AUTH_TOKEN = JwtHelper.generateToken(AUTH_TOKEN_PAYLOAD, config.AUTH_TOKEN_TTL_IN_HOURS);
    const TWO_FA_SECRET = await this.twoFaService.getTwoFaSecretIfNotSetup(user._id);

    const twoFaSetupCode =
      TWO_FA_SECRET &&
      (await QrCode.toDataURL(TotpAuthenticator.getQrCode(TWO_FA_SECRET, data.email)));

    // TODO: HANDLE SESSION MANAGEMENT USING CACHING MECHANISM
    return { user, token: AUTH_TOKEN, twoFaSetupCode } as LoginResponse;
  }

  private handlePasswordlessLogin(user: IUser): void {
    // TODO: ADD DESCRIPTION
    const AUTH_TOKEN_PAYLOAD = this.generateUserAuthTokenPayload(user);
    let authToken = JwtHelper.generateToken(AUTH_TOKEN_PAYLOAD, config.AUTH_TOKEN_TTL_IN_HOURS);

    authToken =
      authToken.substring(0, authToken.length - 10) +
      crypto.randomUUID().substr(0, 8) +
      authToken.substring(authToken.length - 10);

    console.debug(authToken); // TODO: TO BE REMOVED
    const LOGIN_LINK = `${config.WEB_APP_URL}?code=${authToken}`;

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
      userId: user._id,
      isAdmin: user.isAdmin,
      type: tokenType,
    };
  }
}
