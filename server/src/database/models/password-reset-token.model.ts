import { model, Schema } from "mongoose";
import { MongooseUuid } from "../mongoose-uuid.type";
import { IPasswordResetToken } from "../types/password-reset-token.type";

const PasswordResetTokenSchema = new Schema(
  {
    _id: {
      /** USER ID */
      type: MongooseUuid,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 60, // MOVE TO CONFIG
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

export default model<IPasswordResetToken>("password_reset_tokens", PasswordResetTokenSchema);
