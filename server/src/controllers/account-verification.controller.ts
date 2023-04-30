import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { ResponseHandler } from "../helpers";
import { UserService } from "../services/user.service";
import { InitiateAccountVerificationDto } from "../models";
import { AccountVerificationService } from "../services/account-verification.service";
import fs from "fs"
import { FileConverter } from "../helpers/file-coverter.helper";

@Service()
@Controller()
export class AccountVerificationController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly accountVerificationService: AccountVerificationService) {}

  /**
   * @method initiateAccountVerification
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async initiateAccountVerification(req: Request, res: Response) {
    const FILES_BUFFERS = FileConverter.toBuffers(req.files as Express.Multer.File[]);

    const USER = await this.accountVerificationService.initiateAccountVerification(
      req.auth?.userId as string,
      req.body as InitiateAccountVerificationDto,
      //   req.files as any,
      FILES_BUFFERS
    );

    ResponseHandler.ok(res, { success: true });
  }
}
