import JWT, { JwtPayload } from "jsonwebtoken";

import config from "../config";
import { UnauthenticatedError } from "../exceptions";

/**
 * @class JwtHelper
 */
export class JwtHelper {
  /**
   * @method generateToken
   * @static
   * @param {Record<string, any>} payload
   * @param {string} expiresIn
   * @return {string}
   */
  static generateToken(payload: Record<string, any>, expiresIn: string): string {
    if (!expiresIn) {
      return JWT.sign(payload, config.JWT_TOKEN_SECRET);
    }

    return JWT.sign(payload, <string>config.JWT_TOKEN_SECRET, { expiresIn });
  }

  /**
   * @method verifyToken
   * @static
   * @param {string} token
   * @return {string|JwtPayload}
   */
  static verifyToken(token: string): string | JwtPayload {
    try {
      return JWT.verify(token, config.JWT_TOKEN_SECRET);
    } catch (err: any) {
      throw new UnauthenticatedError(err.message);
    }
  }
}
