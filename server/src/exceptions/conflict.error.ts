import K from "../constants";
import CustomError from "./custom.error";

/**
 * @class ConflictError
 * @extends CustomError
 */
class ConflictError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   * @param {object} metaData
   */
  constructor(message: string = K.ResponseMessage.ERR_CONFLICT, metaData: object = {}) {
    super(K.HttpStatusCode.CONFLICT, message, metaData);
  }
}

export default ConflictError;
