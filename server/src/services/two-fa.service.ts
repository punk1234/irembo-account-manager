import { Service } from "typedi";
import { ClientSession } from "mongoose";
import { ICryptoData } from "../interfaces";
import UserTwoFaModel from "../database/models/user-two-fa.model";
import { IUserTwoFa } from "../database/types/user-two-fa.type";
import { CryptoHandler } from "../helpers/crypto-handler.helper";
import { TotpAuthenticator } from "../helpers/totp-authenticator.helper";

@Service()
export class TwoFaService {
  /**
   * @name create
   * @async
   * @param {string} userId
   * @param {ClientSession} dbSession
   * @returns {Promise<IUserTwoFa>}
   */
  async create(userId: string, dbSession?: ClientSession): Promise<IUserTwoFa> {
    const plainSecret: string = TotpAuthenticator.getSecret();
    const encryptData: ICryptoData = CryptoHandler.encrypt(plainSecret);

    const twoFa = new UserTwoFaModel({
      _id: userId,
      secret: encryptData.content,
      iv: encryptData.iv,
    });
    return twoFa.save({ session: dbSession });
  }
}
