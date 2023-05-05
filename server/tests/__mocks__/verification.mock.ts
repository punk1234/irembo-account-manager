import { IdentificationType, InitiateAccountVerificationDto } from "../../src/models";

/**
 * @class UserMock
 */
export class UserMock {
  static getValidVerificationToInitiate(): InitiateAccountVerificationDto {
    return {
      idType: IdentificationType.NID,
      idNumber: "ABCD1234",
      images: [],
    };
  }
}
