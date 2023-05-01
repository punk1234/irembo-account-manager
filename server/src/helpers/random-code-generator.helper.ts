import crypto from "crypto";

/**
 * @class RandomCodeGenerator
 */
export class RandomCodeGenerator {
  /**
   * @name get
   * @static
   * @param {number} length
   * @returns {string}
   */
  static get(length: number = 40): string {
    if (length < 1) {
      throw new Error("Minimum length of token is 1");
    }

    return crypto
      .randomBytes(length)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/, "-")
      .substr(0, length);
  }

  /**
   * @name getFromUUID
   * @static
   * @returns {string}
   */
  static getFromUUID(): string {
    return crypto.randomUUID().replace(/-/g, "");
  }

  /**
   * @method getNumericOtp
   * @static
   * @param {number} length
   * @returns {string}
   */
  static getNumericOtp(length: number = 6): string {
    let str = "";
    for (let i = 0; i < length; i++) {
      str += crypto.randomInt(10);
    }

    return str;
  }
}
