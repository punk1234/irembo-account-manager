import { Service } from "typedi";
import { ClientSession } from "mongoose";
import PasswordResetTokenModel from "../database/models/password-reset-token.model";
import { IPasswordResetToken } from "../database/types/password-reset-token.type";
import { PasswordHasher } from "../helpers";

@Service()
export class PasswordResetService {
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
}
