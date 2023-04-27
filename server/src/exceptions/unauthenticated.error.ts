import K from "../constants";
import CustomError from "./custom.error";

/**
 * @class UnauthenticatedError
 * @extends CustomError
 */
class UnauthenticatedError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   * @param {object} metaData
   */
  constructor(message: string = K.ResponseMessage.ERR_UNAUTHENTICATED, metaData: object = {}) {
    super(K.HttpStatusCode.UNAUTHENTICATED, message, metaData);
  }
}

export default UnauthenticatedError;
