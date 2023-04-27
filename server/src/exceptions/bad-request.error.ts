import K from "../constants";
import CustomError from "./custom.error";

/**
 * @class BadRequestError
 * @extends CustomError
 */
class BadRequestError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   * @param {object} metaData
   */
  constructor(message: string = K.ResponseMessage.ERR_BAD_REQUEST, metaData: object = {}) {
    super(K.HttpStatusCode.BAD_REQUEST, message, metaData);
  }
}

export default BadRequestError;
