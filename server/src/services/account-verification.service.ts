import { Inject, Service } from "typedi";
import { InitiateAccountVerificationDto, VerificationStatus } from "../models";
import AccountVerificationModel from "../database/models/account-verification.model";
import { FileManager } from "./external/file-manager.service";
import { IFileUploadData } from "../interfaces";
import { UserService } from "./user.service";
import config from "../config";
import { IAccountVerification } from "../database/types/account-verification.type";

@Service()
export class AccountVerificationService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly fileManager: FileManager,
    @Inject() private readonly userService: UserService,
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
    uploadData: Array<IFileUploadData>,
  ): Promise<void> {
    // const foundVerification = await AccountVerificationModel.findOne({ _id: userId });

    // UPLOAD FILES TO CLOUDINARY
    const uploadUrls = await this.fileManager.uploadFiles(
      uploadData,
      config.VERIFICATION_DOCS_BUCKET,
    );

    // NOTE: CAN USER `Promise.all` FOR THE NEXT OPERATIONS
    await AccountVerificationModel.findOneAndUpdate(
      { _id: userId },
      { ...data, status: VerificationStatus.PENDING, images: uploadUrls },
      { upsert: true },
    );

    // UPDATE USER VERIFIED STATUS & UPDATE ACCOUNT-VERIFICATION DETAILS
    await this.userService.resetVerifiedValue(userId);
  }

  /**
   * @method getVerificationInfo
   * @async
   * @param {string} userId
   * @returns {Promise<IAccountVerification|null>}
   */
  async getVerificationInfo(userId: string): Promise<IAccountVerification | null> {
    return AccountVerificationModel.findOne({ _id: userId });
  }
}
