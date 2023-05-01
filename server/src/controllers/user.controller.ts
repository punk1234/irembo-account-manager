import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { FileHelper, ResponseHandler } from "../helpers";
import { UserService } from "../services/user.service";
import { UpdateProfileDto } from "../models";

@Service()
@Controller()
export class UserController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly userService: UserService) {}

  /**
   * @method getProfile
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async getProfile(req: Request, res: Response) {
    const USER = await this.userService.checkThatUserExist(req.auth?.userId as string);

    ResponseHandler.ok(res, USER);
  }

  /**
   * @method updateProfile
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async updateProfile(req: Request, res: Response) {
    const DATA = req.body as UpdateProfileDto;
    let uploadData;

    const photoFile = (req.files as Express.Multer.File[])[0];
    req.files && (uploadData = FileHelper.toUploadData([photoFile]));

    const USER = await this.userService.updateProfile(
      req.auth?.userId as string,
      DATA,
      uploadData && uploadData[0],
    );

    ResponseHandler.ok(res, USER);
  }

  /**
   * @method getUsers
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async getUsers(req: Request, res: Response) {
    const USERS = await this.userService.getUsers(req.query);

    ResponseHandler.ok(res, USERS);
  }
}
