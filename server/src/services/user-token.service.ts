import { Inject, Service } from "typedi";
import { ClientSession } from "mongoose";
import C from "../constants";
import { UserService } from "./user.service";
import { IUserToken } from "../database/types/user-token.type";
import { DateTimeCalculator, PasswordHasher } from "../helpers";
import { UnauthenticatedError, UnprocessableError } from "../exceptions";
import { UserTokenType } from "../constants/user-token-type.const";
import UserTokenModel from "../database/models/user-token.model";

@Service()
export class UserTokenService {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly userService: UserService) {}

  /**
   * @method saveToken
   * @async
   * @param {string} userId
   * @param {string} token
   * @param {UserTokenType} type
   * @param {ClientSession} dbSession
   * @returns {Promise<IPasswordResetToken>}
   */
  async saveToken(
    userId: string,
    token: string,
    type: UserTokenType,
    dbSession?: ClientSession,
  ): Promise<IUserToken> {
    const expiresAt: Date = DateTimeCalculator.getDateTimeInNext(1);

    return UserTokenModel.findOneAndUpdate(
      { userId, type },
      { value: PasswordHasher.hash(token), createdAt: new Date(), expiresAt },
      { upsert: true, new: true, session: dbSession },
    );
  }

  /**
   * @method checkThatUserTokenIsValid
   * @async
   * @param {string} userId
   * @param {string} token
   * @param {UserTokenType} type
   * @returns {Promise<IUserToken>}
   */
  async checkThatUserTokenIsValid(
    userId: string,
    token: string,
    type: UserTokenType = UserTokenType.RESET_PASSWORD,
  ): Promise<IUserToken> {
    const foundData = await UserTokenModel.findOne({ userId, type });

    if (!foundData) {
      throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
    }

    this.checkThatTokenHasNotExpired(foundData.expiresAt);
    this.userService.checkThatPasswordsMatch(token, foundData.value);

    return foundData;
  }

  /**
   * @method deleteUserToken
   * @async
   * @param {string} userId
   * @param {UserTokenType} type
   * @returns {Promise<any>}
   */
  async deleteUserToken(userId: string, type: UserTokenType): Promise<any> {
    return UserTokenModel.deleteOne({ userId, type });
  }

  /**
   * @name checkThatTokenHasNotExpired
   * @async
   * @param {Date} expiresAt
   */
  private checkThatTokenHasNotExpired(expiresAt: Date): void {
    if (DateTimeCalculator.isLessThanCurrentTime(expiresAt)) {
      throw new UnprocessableError("Token has expired");
    }
  }
}
