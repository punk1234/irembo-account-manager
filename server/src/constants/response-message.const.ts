/**
 * @enum ResponseMessage
 * @property {string} SUCCESS
 * @property {string} OK
 * @property {string} CREATED
 * @property {string} ACCEPTED
 * @property {string} ERR_BAD_REQUEST
 * @property {string} ERR_UNAUTHENTICATED
 * @property {string} ERR_CONFLICT
 * @property {string} ERR_FORBIDDEN
 * @property {string} ERR_NOT_FOUND
 * @property {string} ERR_UNPROCESSABLE
 * @property {string} ERR_TOO_MANY_REQUEST
 * @property {string} ERR_SERVER
 * @memberOf Constants
 */
export enum ResponseMessage {
  // SUCCESS
  SUCCESS = "Success",
  OK = "Ok",
  CREATED = "New resource created",
  ACCEPTED = "Accepted",

  // ERRORS
  ERR_BAD_REQUEST = "Bad Request",
  ERR_UNAUTHENTICATED = "Unauthenticated Error",
  ERR_UNAUTHORIZED = "Access denied!",
  ERR_CONFLICT = "Conflict Error",
  ERR_NOT_FOUND = "Not Found Error",
  ERR_UNPROCESSABLE = "Unprocessable Entity Error",
  ERR_TOO_MANY_REQUEST = "Too Many Requests Error",
  ERR_SERVER = "Server Error",

  ERR_INVALID_CREDENTIALS = "Invalid user credentials!",
}
