/**
 * @interface IAuthTokenPayload
 */
export interface IAuthTokenPayload {
  userId: string;
  isAdmin: boolean;
  sessionId: string;
}
