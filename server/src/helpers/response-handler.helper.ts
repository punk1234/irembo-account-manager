import C from "../constants";
import { Response } from "express";
import { HttpStatusCode } from "../constants/http-status-code.const";

/**
 * @class ResponseHandler
 */
export class ResponseHandler {
  /**
   * @method send
   * @param {Response} res Express response object
   * @param {HttpStatusCode} statusCode Response status code
   * @param {object} [data] Response data
   * @param {string} [message] Optional response message
   * @memberOf ResponseHandler
   */
  static send(
    res: Response,
    statusCode: HttpStatusCode,
    data?: object,
    message: string = C.ResponseMessage.SUCCESS,
  ) {
    return res.status(statusCode).json(data || { message });
  }

  /**
   * @method ok
   * @param {Response} res Express response object
   * @param {object} [data] Response data
   * @param {string} [message] Optional response message
   * @memberOf ResponseHandler
   */
  static ok(res: Response, data?: object, message: string = C.ResponseMessage.OK) {
    return ResponseHandler.send(res, C.HttpStatusCode.SUCCESS, data, message);
  }

  /**
   * @method created
   * @param {Response} res Express response object
   * @param {object} [data] Response data
   * @param {string} [message] Optional response message
   * @memberOf ResponseHandler
   */
  static created(res: Response, data?: object, message: string = C.ResponseMessage.CREATED) {
    return ResponseHandler.send(res, C.HttpStatusCode.CREATED, data, message);
  }

  /**
   * @method accepted
   * @param {Response} res Express response object
   * @param {object} [data] Response data
   * @param {string} [message] Optional response message
   * @memberOf ResponseHandler
   */
  static accepted(res: Response, data?: object, message: string = C.ResponseMessage.ACCEPTED) {
    return ResponseHandler.send(res, C.HttpStatusCode.ACCEPTED, data, message);
  }

  /**
   * @method redirect
   * @param {Response} res Express response object
   * @param {string} url Url to redirect to
   * @param {RedirectStatusCode} [statusCode=301] Redirect status code, accept either 301 or 302
   * @memberOf ResponseHandler
   */
  static redirect(res: Response, url: string) {
    return res.status(C.HttpStatusCode.REDIRECT_TEMP).redirect(url);
  }
}
