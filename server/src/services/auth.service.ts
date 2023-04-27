import { Inject, Service } from "typedi";
import { ClientSession } from "mongoose";
import { UserService } from "./user.service";
import { RegisterUserDto } from "../models";
import { TwoFaService } from "./two-fa.service";
import { CountryManager, DbTransactionHelper } from "../helpers";
import { BadRequestError } from "../exceptions";

@Service()
export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly twoFaService: TwoFaService,
  ) {}

  /**
   * @method register
   * @async
   * @param {RegisterUserDto} data
   * @returns {Promise<void>}
   */
  async register(data: RegisterUserDto): Promise<void> {
    data.email = data.email.toLowerCase();
    data.countryCode = data.countryCode.toUpperCase();

    if (!CountryManager.getNameByCode(data.countryCode)) {
      throw new BadRequestError("Invalid country!");
    }

    await this.userService.checkThatUserWithEmailDoesNotExist(data.email);

    await DbTransactionHelper.execute(async (dbSession?: ClientSession) => {
      const USER = await this.userService.createUser(data, dbSession);
      await this.twoFaService.create(USER._id, dbSession);
    });
  }
}
