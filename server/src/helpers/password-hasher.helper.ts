import bcrypt from "bcryptjs";

/**
 * @class PasswordHasher
 */
export class PasswordHasher {
  /**
   * @name hash
   * @static
   * @param {string} plainTextPasword
   * @memberof PasswordHasher
   * @returns {string}
   */
  static hash(plainTextPasword: string): string {
    if (!plainTextPasword) {
      throw new Error("Invalid plain-text password");
    }

    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainTextPasword, salt);
  }

  /**
   * @name verify
   * @static
   * @memberof PasswordHasher
   * @param {string} plainTextPasword
   * @param {string} hashedPassword
   * @returns {boolean}
   */
  static verify(plainTextPasword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainTextPasword, hashedPassword);
  }
}
