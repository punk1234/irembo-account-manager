import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { FileHelper, ResponseHandler } from "../helpers";
import { InitiateAccountVerificationDto, UpdateAccountVerificationStatusDto } from "../models";
import { AccountVerificationService } from "../services/account-verification.service";
import { IdentityDocVerifier } from "../services/external/identity-doc-verifier.service";
import { IAccountVerification } from "../database/types/account-verification.type";

@Service()
@Controller()
export class AccountVerificationController {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly identityDocVerifier: IdentityDocVerifier,
    @Inject() private readonly accountVerificationService: AccountVerificationService,
  ) {}

  /**
   * @method initiateAccountVerification
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async initiateAccountVerification(req: Request, res: Response) {
    const data = req.body as InitiateAccountVerificationDto;

    this.identityDocVerifier.verifyUserDocument(data.idNumber, data.idType);
    const UPLOAD_DATA = FileHelper.toUploadData(req.files as Express.Multer.File[]);

    await this.accountVerificationService.initiateAccountVerification(
      req.auth?.userId as string,
      req.body as InitiateAccountVerificationDto,
      UPLOAD_DATA,
    );

    ResponseHandler.ok(res, { success: true });
  }

  /**
   * @method getVerificationInfo
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async getVerificationInfo(req: Request, res: Response) {
    const verificationInfo: IAccountVerification | null =
      await this.accountVerificationService.getVerificationInfo(req.auth?.userId as string);

    ResponseHandler.ok(res, { success: !!verificationInfo, data: verificationInfo });
  }

  /**
   * @method updateAccountVerificationStatus
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async updateAccountVerificationStatus(req: Request, res: Response) {
    const verificationInfo = await this.accountVerificationService.updateAccountVerificationStatus(
      req.params.userId,
      (req.body as UpdateAccountVerificationStatusDto).status,
    );

    ResponseHandler.ok(res, { success: verificationInfo });
  }

  /**
   * @method getAccountVerificationRequests
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async getAccountVerificationRequests(req: Request, res: Response) {
    const verificationRequests =
      await this.accountVerificationService.getAccountVerificationRequests(req.query);

    ResponseHandler.ok(res, verificationRequests);
  }
}
