import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { ResponseHandler } from "../helpers";
import { LoginDto, RegisterUserDto } from "../models";
import { AuthService } from "../services/auth.service";

@Service()
@Controller()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private authService: AuthService) {}

  /**
   * @method register
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async register(req: Request, res: Response) {
    await this.authService.register(req.body as RegisterUserDto);

    ResponseHandler.created(res, { success: true });
  }

  /**
   * @method login
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async login(req: Request, res: Response) {
    const loginResponse = await this.authService.login(req.body as LoginDto);

    ResponseHandler.ok(res, loginResponse);
  }
}
