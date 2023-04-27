import K from "../constants";
import CustomError from "./custom.error";

/**
 * @class UnauthorizedError
 * @extends CustomError
 */
class UnauthorizedError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   * @param {object} metaData
   */
  constructor(message: string = K.ResponseMessage.ERR_UNAUTHORIZED, metaData: object = {}) {
    super(K.HttpStatusCode.UNAUTHORIZED, message, metaData);
  }
}

export default UnauthorizedError;
