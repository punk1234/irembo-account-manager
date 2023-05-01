import { Inject, Service } from "typedi";
import { InitiateAccountVerificationDto, VerificationStatus } from "../models";
import AccountVerificationModel from "../database/models/account-verification.model";
import { FileManager } from "./external/file-manager.service";
import { IFileUploadData, IPaginatedData } from "../interfaces";
import { UserService } from "./user.service";
import config from "../config";
import { IAccountVerification } from "../database/types/account-verification.type";
import { BadRequestError, ConflictError, NotFoundError } from "../exceptions";
import { getPaginationSummary } from "../helpers";

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

    await this.userService.setVerifiedValue(userId);
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

  /**
   * @method updateAccountVerificationStatus
   * @async
   * @param {string} userId
   * @param {VerificationStatus} status
   * @returns {Promise<IAccountVerification>}
   */
  async updateAccountVerificationStatus(
    userId: string,
    status: VerificationStatus,
  ): Promise<IAccountVerification> {
    if (status === VerificationStatus.PENDING) {
      throw new BadRequestError("`PENDING` status is not allowed!");
    }

    const VERIFICATION = await this.checkThatUserVerificationExist(userId);

    if (status === VERIFICATION.status) {
      throw new ConflictError(`Verification status is already ${status}`);
    }

    VERIFICATION.status = status;
    await VERIFICATION.save();

    await this.userService.setVerifiedValue(userId, status === VerificationStatus.VERIFIED);
    return VERIFICATION;
  }

  /**
   * @method getAccountVerificationRequests
   * @async
   * @param {Record<string, any>} filter
   * @returns {Promise<IPaginatedData<any>>}
   */
  async getAccountVerificationRequests(filter: Record<string, any>): Promise<IPaginatedData<any>> {
    const { status = VerificationStatus.PENDING, page = 1, limit = 10 } = filter;

    const { data, filterCount } = (
      await AccountVerificationModel.aggregate([
        { $match: { status } },
        { $sort: { createdAt: 1 } },
        { $lookup: { from: "users", foreignField: "_id", localField: "_id", as: "user" } },

        {
          $project: {
            _id: 0,
            id: "$_id",
            idType: 1,
            idNumber: 1,
            status: 1,
            createdAt: 1,
            email: { $first: "$user.email" },
            firstName: { $first: "$user.firstName" },
            lastName: { $first: "$user.lastName" },
            nationality: { $first: "$user.nationality" },
          },
        },

        {
          $facet: {
            data: [{ $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) }],
            filterCount: [{ $count: "count" }],
          },
        },
      ])
    )[0];

    return getPaginationSummary(data, filterCount["count"], { page, limit });
  }

  /**
   * @method checkThatUserVerificationExist
   * @async
   * @param {string} userId
   * @returns {Promise<IAccountVerification>}
   */
  private async checkThatUserVerificationExist(userId: string): Promise<IAccountVerification> {
    const foundVerification = await AccountVerificationModel.findOne({ _id: userId });
    if (foundVerification) {
      return foundVerification;
    }

    throw new NotFoundError("User account-verificatiuon not found!");
  }
}
