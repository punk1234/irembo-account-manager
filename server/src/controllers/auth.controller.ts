import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { ResponseHandler } from "../helpers";
import { LoginDto, RegisterUserDto, SendPasswordResetLinkDto, VerifyTwoFaDto } from "../models";
import { AuthService } from "../services/auth.service";

@Service()
@Controller()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly authService: AuthService) {}

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

  /**
   * @method verifyTwoFa
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async verifyTwoFa(req: Request, res: Response) {
    const loginResponse = await this.authService.verifyTwoFa(
      req.auth?.userId as string,
      req.body as VerifyTwoFaDto,
    );

    ResponseHandler.ok(res, loginResponse);
  }

  /**
   * @method sendPasswordResetLink
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async sendPasswordResetLink(req: Request, res: Response) {
    await this.authService.sendPasswordResetLink((req.body as SendPasswordResetLinkDto).email);

    ResponseHandler.ok(res, {});
  }
}
