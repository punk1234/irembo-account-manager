import { CorsOptions } from "cors";
import { Request, Response } from "express";

/**
 * @interface IAppOptions
 */
export interface IAppOptions {
  requestSizeLimit?: string;
  urlEncodeExtended?: boolean;

  errors?: { includeStackTrace?: boolean };

  cors?: CorsOptions;
  compression?: { filter: (req: Request, res: Response) => any };
}
