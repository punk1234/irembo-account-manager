import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../exceptions";

/**
 * @function imageMimeTypeValidator
 * @param {string} field
 * @param {boolean} required
 *
 * @description
 * This is a validation middleware that validates all image requests
 */
export default (field: string, required: boolean = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files;
    let fileType: any;

    try {
      req.body[field] = undefined;

      for (const file of files) {
        if (file.fieldname == field) {
          fileType = file.mimetype.split("/")[0];

          if (fileType != "image") {
            throw new BadRequestError(`${field} is not an image`);
          }
        }
      }

      if (required && !fileType) {
        throw new BadRequestError(`${field} must be uploaded`);
      }

      next();
    } catch (err: any) {
      res.status(err.statusCode).json({
        code: err.constructor.name,
        message: err.message,
      });
    }
  };
