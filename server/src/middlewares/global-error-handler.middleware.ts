import C from "../constants";
import { CustomError } from "../exceptions";
import { ResponseHandler } from "../helpers";
import { error } from "express-openapi-validator";
import { Request, Response, NextFunction } from "express";

/**
 * @function handleThrownErrorResponse
 * @param {boolean} includeStackTrace
 * @returns {Function}
 */
const handleThrownErrorResponse = (includeStackTrace: boolean) => {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof CustomError) {
      return ResponseHandler.send(
        res,
        err.statusCode,
        includeStackTrace ? { message: err.message, error: err?.stack } : undefined,
        err.message,
      );
    }

    return ResponseHandler.send(
      res,
      C.HttpStatusCode.SERVER_ERROR,

      // NOTE: CAN ALSO USE `{}` BELOW, BUT NO NEED TO CREATE MEMORY FOR EMPTY OBJECT
      includeStackTrace ? { message: err.message, error: err?.stack } : undefined,

      err.message,
    );
  };
};

/**
 * @function errorHandler
 * @description
 * This middleware handles error for both open-api validation & app exceptions
 *
 * @returns {Function}
 */
export const errorHandler = (includeStackTrace: boolean) => {
  const allOpenApiErrors = Object.values(error);

  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (allOpenApiErrors.includes(err.constructor)) {
      // OPEN-API VALIDATION ERROR HANDLER
      res.status(err.status || C.HttpStatusCode.SERVER_ERROR).json({
        code: err.constructor.name,
        message: err.message,
        data: {
          errors: err.errors,
        },
      });

      return;
    } else if (process.env.NODE_ENV === C.Environment.DEVELOPMENT) {
      console.error(err?.stack);
    }

    handleThrownErrorResponse(includeStackTrace)(err, req, res, next);
  };
};
