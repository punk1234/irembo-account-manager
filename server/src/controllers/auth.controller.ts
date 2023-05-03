import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { ResponseHandler } from "../helpers";
import {
  LoginDto,
  RegisterUserDto,
  ResetPasswordDto,
  SendPasswordResetLinkDto,
  VerifyTwoFaDto,
} from "../models";
import { AuthService } from "../services/auth.service";
import { SessionService } from "../services/session.service";

@Service()
@Controller()
export class AuthController {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly sessionService: SessionService,
  ) {}

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
   * @method logout
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async logout(req: Request, res: Response) {
    await this.sessionService.invalidateSession(req.auth?.userId as string);

    ResponseHandler.ok(res, { success: true });
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

    ResponseHandler.ok(res, { message: "Check your mail for reset-link!" });
  }

  /**
   * @method resetPassword
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async resetPassword(req: Request, res: Response) {
    await this.authService.resetPassword(req.body as ResetPasswordDto);

    ResponseHandler.ok(res, { success: true });
  }
}
