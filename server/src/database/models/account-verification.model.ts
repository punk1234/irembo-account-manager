import { model, Schema } from "mongoose";
import { MongooseUuid } from "../mongoose-uuid.type";
import { IdentificationType, VerificationStatus } from "../../models";
import { IAccountVerification } from "../types/account-verification.type";

const AccountVerificationSchema = new Schema(
  {
    _id: {
      /** USER ID */
      type: MongooseUuid,
      required: true,
    },
    idType: {
      type: String,
      enum: Object.values(IdentificationType),
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: () => VerificationStatus.PENDING,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: false,

      transform: function (doc: any, ret: any) {
        delete ret._id;
      },
    },
  },
);

export default model<IAccountVerification>("account_verifications", AccountVerificationSchema);
