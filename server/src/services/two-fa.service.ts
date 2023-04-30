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
   * @method create
   * @instance
   * @param {string} userId
   * @param {ClientSession} dbSession
   * @returns {Promise<IUserTwoFa>}
   */
  create(userId: string, dbSession?: ClientSession): Promise<IUserTwoFa> {
    const plainSecret: string = TotpAuthenticator.getSecret();
    const encryptData: ICryptoData = CryptoHandler.encrypt(plainSecret);

    const twoFa = new UserTwoFaModel({
      _id: userId,
      secret: encryptData.content,
      iv: encryptData.iv,
    });

    return twoFa.save({ session: dbSession });
  }

  //   /**
  //    * @name hasTwoFaBeenSetup
  //    * @async
  //    * @param {string} userId
  //    * @returns {Promise<boolean>}
  //    */
  //   async hasTwoFaBeenSetup(userId: string): Promise<boolean> {
  //     const twoFa = await UserTwoFaModel.findOne({ _id: userId });

  //     return !!twoFa?.verifiedAt;
  //   }

  /**
   * @name getTwoFaSecretIfNotSetup
   * @async
   * @param {string} userId
   * @returns {Promise<string|undefined>}
   */
  async getTwoFaSecretIfNotSetup(userId: string): Promise<string | undefined> {
    const twoFa = await UserTwoFaModel.findOne({ _id: userId });

    if (twoFa && !twoFa.verifiedAt) {
      return CryptoHandler.decrypt({
        content: twoFa.secret,
        iv: twoFa.iv,
      });
    }
  }
}
