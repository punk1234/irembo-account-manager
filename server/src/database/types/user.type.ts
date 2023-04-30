import { Document } from "mongoose";
import { User } from "../../models";
import { UUID } from "../mongoose-uuid.type";

interface UserDoc extends Document {
  _id: UUID;
  password?: string;
}

export type IUser = Omit<User, "id"> & UserDoc;
