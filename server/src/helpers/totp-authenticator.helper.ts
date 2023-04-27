import SpeakEasy from "speakeasy";
import config from "../config";

/**
 * @class TotpAuthenticator
 */
export class TotpAuthenticator {
  /**
   * @method getSecret
   * @static
   * @memberof TotpAuthenticator
   * @returns {string}
   */
  static getSecret(): string {
    const secret = SpeakEasy.generateSecret({ length: 16 });

    return secret.base32;
  }

  /**
   * @method getQrCode
   * @static
   * @memberof TotpAuthenticator
   * @param {string} secret
   * @param {string} email
   * @param {string} issuerName
   * @returns {string}
   */
  static getQrCode(
    secret: string,
    email: string,
    issuerName: string = config.TOTP_ISSUER_NAME,
  ): string {
    if (!secret) {
      throw new Error("Secret must have a valid value");
    }

    return `otpauth://totp/${email}?secret=${secret}&issuer=${issuerName}`;
  }

  /**
   * @method verify
   * @static
   * @memberof TotpAuthenticator
   * @param {string} secret
   * @param {string} twoFaCode
   * @returns {boolean}
   */
  static verify(secret: string, twoFaCode: string): boolean {
    return SpeakEasy.totp.verify({
      secret,
      token: twoFaCode,
      encoding: "base32",
      /* window: 1 */
    });
  }

  /**
   * @method getTotpCode
   * @static
   * @memberof TotpAuthenticator
   * @param {string} secret
   * @returns {string}
   */
  static getTotpCode(secret: string): string {
    return SpeakEasy.totp({
      secret,
      encoding: "base32",
    });
  }
}
