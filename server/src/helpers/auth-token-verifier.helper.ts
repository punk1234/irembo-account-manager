import { JwtHelper } from "./jwt.helper";
import { IAuthTokenPayload } from "../interfaces";
import { UnauthenticatedError } from "../exceptions";

/**
 * @function _checkThatValidTokenFormatIsProvided
 * @param {string|undefined} authToken
 * @return {string} auth token
 */
const _checkThatValidTokenFormatIsProvided = (authToken: string | undefined): string => {
  let splitToken;

  if (
    // NOTE: CAN ALSO USE `startsWith("Bearer ")` here
    !authToken ||
    (splitToken = authToken.split(" ")).length !== 2 ||
    splitToken[0].toLowerCase() !== "bearer" ||
    !splitToken[1]
  ) {
    throw new UnauthenticatedError("Invalid token!");
  }

  return splitToken[1];
};

/**
 * @function verifyAuthToken
 * @param {Record<string, any>} headers
 * @return {IAuthTokenPayload}
 */
export const verifyAuthToken = (headers: Record<string, any>): IAuthTokenPayload => {
  const authHeader = headers["authorization"];

  const authToken = _checkThatValidTokenFormatIsProvided(authHeader);
  const authPayload = JwtHelper.verifyToken(authToken);

  return authPayload as IAuthTokenPayload;
};
