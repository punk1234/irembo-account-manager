import { Service } from "typedi";
import { UnprocessableError } from "../../exceptions";
import { IdentificationType } from "../../models";

@Service()
export class IdentityDocVerifier {
  private PASSPORT_CODE_LENGTH = 9;

  private NID_MINIMUM_LENGTH = 8;
  private NID_MAXIMUM_LENGTH = 15;

  /**
   * @method verifyUserDocument
   * @instance
   * @param {string} idNumber
   * @param {IdentificationType} idType
   */
  verifyUserDocument(idNumber: string, idType: IdentificationType): void {
    if (idType === IdentificationType.PASSPORT && idNumber.length !== this.PASSPORT_CODE_LENGTH) {
      throw new UnprocessableError(
        `Passport No. must be ${this.PASSPORT_CODE_LENGTH} characters long!`,
      );
    }

    if (
      idType === IdentificationType.NID &&
      (idNumber.length < this.NID_MINIMUM_LENGTH || idNumber.length > this.NID_MAXIMUM_LENGTH)
    ) {
      throw new UnprocessableError(
        `NID No. must be ${this.NID_MINIMUM_LENGTH}-${this.NID_MAXIMUM_LENGTH} characters long!`,
      );
    }
  }
}
