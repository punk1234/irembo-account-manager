import K from "../constants";
import CustomError from "./custom.error";

/**
 * @class ServerError
 * @extends CustomError
 */
class ServerError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   * @param {object} metaData
   */
  constructor(message: string, metaData: object = {}) {
    super(K.HttpStatusCode.SERVER_ERROR, message, metaData);
  }
}

export default ServerError;
