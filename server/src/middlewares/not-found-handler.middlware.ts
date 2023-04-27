import { Request } from "express";
import { NotFoundError } from "../exceptions";

/**
 * @function notFoundHandler
 * @description
 * This is a middleware that handles unknown request route
 *
 * @param {Request} req Express req object
 */
export const notFoundHandler = (req: Request) => {
  throw new NotFoundError(`Method [${req.method}] not found for route [${req.originalUrl}]`);
};
