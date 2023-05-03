import { model, Schema } from "mongoose";
import C from "../../constants";
import { MongooseUuid } from "../mongoose-uuid.type";
import { IUserToken } from "../types/user-token.type";

const UserTokenSchema = new Schema(
  {
    userId: {
      type: MongooseUuid,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(C.UserTokenType),
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    toJSON: {
      versionKey: false,
      virtuals: false,

      transform: function (doc: any, ret: any) {
        delete ret._id;
        ret.id = doc._id.toUUID();
      },
    },
  },
);

export default model<IUserToken>("user_tokens", UserTokenSchema);
