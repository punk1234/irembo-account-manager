import { Document } from "mongoose";
import { IdentificationType, VerificationStatus } from "../../models";

export interface IAccountVerification extends Document {
  _id: string;
  idType: IdentificationType;
  idNumber: string;
  status: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}
