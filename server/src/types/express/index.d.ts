import { IAuthTokenPayload } from "../../interfaces";

declare global {
  namespace Express {
    export interface Request {
      auth?: IAuthTokenPayload;
    }
  }
}
