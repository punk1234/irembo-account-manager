import { Service } from "typedi";
import { ClientSession } from "mongoose";
import { ICryptoData } from "../interfaces";
import UserTwoFaModel from "../database/models/user-two-fa.model";
import { IUserTwoFa } from "../database/types/user-two-fa.type";
import { CryptoHandler } from "../helpers/crypto-handler.helper";
import { TotpAuthenticator } from "../helpers/totp-authenticator.helper";
import { NotFoundError, UnauthenticatedError } from "../exceptions";

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

    // console.debug(plainSecret);
    const twoFa = new UserTwoFaModel({
      _id: userId,
      secret: encryptData.content,
      iv: encryptData.iv,
    });

    return twoFa.save({ session: dbSession });
  }

  async verify(userId: string, twoFaCode: string): Promise<IUserTwoFa> {
    const twoFaSecret: IUserTwoFa = await this.checkThatUserTwoFaSecretExist(userId);
    console.log("@verify-twoFaSecret", twoFaSecret);
    const decryptedSecret: string = CryptoHandler.decrypt({
      content: twoFaSecret.secret,
      iv: twoFaSecret.iv,
    });

    const isTotpValid = TotpAuthenticator.verify(decryptedSecret, twoFaCode);
    if (!isTotpValid) {
      throw new UnauthenticatedError("2FA code is invalid");
    }

    await this.markTwoFaAsVerifiedIfNotMarked(twoFaSecret);

    return twoFaSecret;
  }

  /**
   * @name checkThatUserTwoFaSecretExist
   * @static
   * @async
   * @param {string} userId
   * @returns {Promise<IUserTwoFa>}
   */
  private async checkThatUserTwoFaSecretExist(userId: string): Promise<IUserTwoFa> {
    const foundUserTwoFa = await UserTwoFaModel.findOne({ _id: userId });
    if (!foundUserTwoFa) {
      throw new NotFoundError("User 2FA secret does not exist");
    }

    return foundUserTwoFa;
  }

  /**
   * @method markTwoFaAsVerifiedIfNotMarked
   * @async
   * @param {IUserTwoFa} userTwoFa
   * @returns {Promise<void>}
   */
  private async markTwoFaAsVerifiedIfNotMarked(userTwoFa: IUserTwoFa): Promise<void> {
    if (userTwoFa.verifiedAt) {
      return;
    }

    userTwoFa.verifiedAt = new Date();
    await userTwoFa.save();
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
