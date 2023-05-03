import { Document } from "mongoose";
import { UserTokenType } from "../../constants/user-token-type.const";

export interface IUserToken extends Document {
  _id: string;
  userId: string;
  value: string;
  type: UserTokenType;
  expiresAt: Date;
  createdAt: Date;
}
