import crypto from "crypto";
import config from "../config";
import { ICryptoData } from "../interfaces";

/**
 * @class CryptoHandler
 */
export class CryptoHandler {
  static ALGORITHM = "aes-256-ctr";
  static SECRET_KEY = config.TWO_FA_CRYPTO_SECRET;
  static ENCODING_STYLE: BufferEncoding = "hex";

  /**
   * @method encrypt
   * @static
   * @memberof CryptoHandler
   * @param {string} text
   * @returns {ICryptoData}
   */
  static encrypt(text: string): ICryptoData {
    if (!text) {
      throw new Error("Invalid input");
    }

    const INITIALIZATION_VECTOR: Buffer = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.ALGORITHM, this.SECRET_KEY, INITIALIZATION_VECTOR);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
      content: encrypted.toString(this.ENCODING_STYLE),
      iv: INITIALIZATION_VECTOR.toString(this.ENCODING_STYLE),
    };
  }

  /**
   * @method decrypt
   * @static
   * @memberof CryptoHandler
   * @param {ICryptoData} cryptoData
   * @returns {string}
   */
  static decrypt(cryptoData: ICryptoData): string {
    const INITIALIZATION_VECTOR: Buffer = Buffer.from(cryptoData.iv, this.ENCODING_STYLE);
    const decryptBuffer: Buffer = Buffer.from(cryptoData.content, this.ENCODING_STYLE);

    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      this.SECRET_KEY,
      INITIALIZATION_VECTOR,
    );

    const decrypted = Buffer.concat([decipher.update(decryptBuffer), decipher.final()]);
    return decrypted.toString();
  }
}
