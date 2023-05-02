import { Inject, Service } from "typedi";
import { ClientSession } from "mongoose";
import PasswordResetTokenModel from "../database/models/password-reset-token.model";
import { IPasswordResetToken } from "../database/types/password-reset-token.type";
import { PasswordHasher } from "../helpers";
import { UnauthenticatedError } from "../exceptions";
import C from "../constants";
import { UserService } from "./user.service";

@Service()
export class PasswordResetService {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly userService: UserService) {}

  /**
   * @method saveToken
   * @async
   * @param {string} userId
   * @param {string} token
   * @param {ClientSession} dbSession
   * @returns {Promise<IPasswordResetToken>}
   */
  async saveToken(
    userId: string,
    token: string,
    dbSession?: ClientSession,
  ): Promise<IPasswordResetToken> {
    return PasswordResetTokenModel.findOneAndUpdate(
      { _id: userId },
      { value: PasswordHasher.hash(token), createdAt: new Date() },
      { upsert: true, new: true, session: dbSession },
    );
  }

  /**
   * @method checkThatUserResetTokenIsValid
   * @async
   * @param {string} userId
   * @param {string} token
   * @returns {Promise<IPasswordResetToken>}
   */
  async checkThatUserResetTokenIsValid(
    userId: string,
    token: string,
  ): Promise<IPasswordResetToken> {
    const foundData = await PasswordResetTokenModel.findOne({ _id: userId });

    if (!foundData) {
      throw new UnauthenticatedError(C.ResponseMessage.ERR_INVALID_CREDENTIALS);
    }

    this.userService.checkThatPasswordsMatch(token, foundData.value);
    return foundData;
  }

  /**
   * @method deleteUserToken
   * @async
   * @param {string} userId
   * @returns {Promise<any>}
   */
  async deleteUserToken(userId: string): Promise<any> {
    return PasswordResetTokenModel.deleteOne({ _id: userId });
  }
}
