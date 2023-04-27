import { Document } from "mongoose";

export interface IUserTwoFa extends Document {
  _id: string;
  secret: string;
  iv: string;
  verifiedAt: Date;
}
