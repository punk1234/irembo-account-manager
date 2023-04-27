/**
 * @class CustomError
 * @extends Error
 */
abstract class CustomError extends Error {
  readonly statusCode: number;
  readonly metaData: object;

  /**
   * @constructor
   * @param {number} statusCode
   * @param {string} message
   * @param {object} metaData
   */
  constructor(statusCode: number, message: string, metaData: object = {}) {
    super(message);

    this.statusCode = statusCode;
    this.metaData = metaData;
  }
}

export default CustomError;
