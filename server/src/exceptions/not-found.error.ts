import K from "../constants";
import CustomError from "./custom.error";

/**
 * @class NotFoundError
 * @extends CustomError
 */
class NotFoundError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   * @param {object} metaData
   */
  constructor(message: string = K.ResponseMessage.ERR_NOT_FOUND, metaData: object = {}) {
    super(K.HttpStatusCode.NOT_FOUND, message, metaData);
  }
}

export default NotFoundError;
