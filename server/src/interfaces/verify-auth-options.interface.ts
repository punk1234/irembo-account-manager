import { AuthTokenType } from "../constants/auth-token-type.const";

/**
 * @interface IVerifyAuthOptions
 */
export interface IVerifyAuthOptions {
  forAdmin?: boolean;
  tokenType?: AuthTokenType;
}
