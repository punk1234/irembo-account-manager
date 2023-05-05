import Container from "typedi";
import { ClientSession } from "mongoose";
import config from "../../config";
import { IRegisterUserDto } from "../../interfaces";
import { DbTransactionHelper, Logger } from "../../helpers";
import { TwoFaService } from "../../services/two-fa.service";
import { UserService } from "../../services/user.service";

const USER_SERVICE = Container.get(UserService);
const TWO_FA_SERVICE = Container.get(TwoFaService);

/**
 * @class SuperAdminSeeder
 */
class SuperAdminSeeder {
  /**
   * @method seed
   * @static
   * @async
   */
  static async seed() {
    const ROOT_SUPER_ADMIN_DATA = SuperAdminSeeder.getRootAdminData();

    await DbTransactionHelper.execute(async (dbSession?: ClientSession) => {
      const USER = await USER_SERVICE.createUser(ROOT_SUPER_ADMIN_DATA, dbSession);
      await TWO_FA_SERVICE.create(USER._id.toUUIDString(), dbSession);

      USER_SERVICE.markUserAsActive(USER._id.toUUIDString());
    });
  }

  /**
   * @name getRootAdminData
   * @static
   * @returns
   */
  private static getRootAdminData(): IRegisterUserDto {
    return {
      email: config.SUPER_ADMIN_EMAIL as string,
      password: config.SUPER_ADMIN_PASSWORD as string,
      countryCode: "NG",
      isAdmin: true,
    };
  }
}

/******************************************************
 ******************** MAIN SEEDER *********************
 ******************************************************/

export default async function main(): Promise<void> {
  if (!config.SUPER_ADMIN_EMAIL || !config.SUPER_ADMIN_PASSWORD) {
    Logger.info("SKIPPING >> SEEDING FOR ADMIN");
    return;
  }

  try {
    if (await USER_SERVICE.getUserByEmail(config.SUPER_ADMIN_EMAIL as string)) {
      Logger.info("SKIPPING >> SEEDING FOR ADMIN");
      return;
    }

    Logger.info("READY TO SEED ADMIN(S)!");
    await SuperAdminSeeder.seed();

    Logger.info("SEEDING COMPLETED SUCCESSFULLY!");
  } catch (err: any) {
    Logger.error(`[SEEDING FAILED]: ${err.message}`);
    process.exit(1);
  }
}
