import { Document } from "mongoose";

export interface IPasswordResetToken extends Document {
  _id: string;
  value: string;
  createdAt: Date;
}
