import { Inject, Service } from "typedi";
import { InitiateAccountVerificationDto, VerificationStatus } from "../models";
import { IUser } from "../database/types/user.type";
import UserModel from "../database/models/user.model";
import AccountVerificationModel from "../database/models/account-verification.model";
import { FileManager } from "./external/file-manager.service";

@Service()
export class AccountVerificationService {

        // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly fileManager: FileManager
  ) {}

  /**
   * @method initiateAccountVerification
   * @async
   * @param {string} userId
   * @param {InitiateAccountVerificationDto} data
   * @returns {Promise<IUser>}
   */
  async initiateAccountVerification(
    userId: string,
    data: InitiateAccountVerificationDto,
    // files: Array<File>,
    filesBuffers: Array<string>
  ): Promise<void> {
    // const foundVerification = await AccountVerificationModel.findOne({ _id: userId });

    // UPLOAD FILES TO CLOUDINARY
    await this.fileManager.uploadFile(filesBuffers[0]);

    // UPDATE USER VERIFIED STATUS & UPDATE ACCOUNT-VERIFICATION DETAILS

  }
}
