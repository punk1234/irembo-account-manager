import K from "../constants";
import CustomError from "./custom.error";

/**
 * @class UnprocessableError
 * @extends CustomError
 */
class UnprocessableError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   * @param {object} metaData
   */
  constructor(message: string = K.ResponseMessage.ERR_UNPROCESSABLE, metaData: object = {}) {
    super(K.HttpStatusCode.UNPROCESSABLE_ENTITY, message, metaData);
  }
}

export default UnprocessableError;
