import crypto from "crypto";
import { model, Schema } from "mongoose";
import { IUser } from "../types/user.type";
import { Gender, MaritalStatus } from "../../models";
import { MongooseUuid } from "../mongoose-uuid.type";

const UserSchema = new Schema(
  {
    _id: {
      type: MongooseUuid,
      default: () => crypto.randomUUID(),
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    nationality: {
      type: String,
      required: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    photoUrl: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    maritalStatus: {
      type: String,
      enum: Object.values(MaritalStatus),
    },
  },
  {
    timestamps: true,
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

export default model<IUser>("users", UserSchema);
