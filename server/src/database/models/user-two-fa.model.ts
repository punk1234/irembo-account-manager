import { model, Schema } from "mongoose";
import { MongooseUuid } from "../mongoose-uuid.type";
import { IUserTwoFa } from "../types/user-two-fa.type";

const UserTwoFaSchema = new Schema(
  {
    _id: {
      /** USER ID */
      type: MongooseUuid,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    verifiedAt: { type: Date },
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

export default model<IUserTwoFa>("user_two_fas", UserTwoFaSchema);
