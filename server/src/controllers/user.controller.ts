import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { ResponseHandler } from "../helpers";
import { UserService } from "../services/user.service";

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
}
