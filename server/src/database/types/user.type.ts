import { Document } from "mongoose";
import { User } from "../../models";

interface UserDoc extends Document {
  _id: string;
  password?: string;
}

export type IUser = Omit<User, "id"> & UserDoc;
