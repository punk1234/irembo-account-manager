import { AuthTokenType } from "../constants/auth-token-type.const";

/**
 * @interface IAuthTokenPayload
 */
export interface IAuthTokenPayload {
  userId: string;
  isAdmin: boolean;
  type?: AuthTokenType;
  sessionId: string;
}
