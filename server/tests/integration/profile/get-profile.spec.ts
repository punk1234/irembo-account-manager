import Container from "typedi";
import request from "supertest";
import { Application } from "express";
import C from "../../../src/constants";
import { UserMock } from "../../__mocks__";
import { LoginResponse } from "../../../src/models";
import AppFactory from "../../__helpers__/app-factory.helper";
import { UserService } from "../../../src/services/user.service";
import { AuthService } from "../../../src/services/auth.service";
import { IUser } from "../../../src/database/types/user.type";
import { TwoFaService } from "../../../src/services/two-fa.service";
import { TotpAuthenticator } from "../../../src/helpers";

const USER_SERVICE = Container.get(UserService);
const AUTH_SERVICE = Container.get(AuthService);
const TWO_FA_SERVICE = Container.get(TwoFaService);

let app: Application;
let user: IUser, userLoginInfo: LoginResponse;
let twoFaSecret: string, authToken: string;

describe("GET /me/profile", () => {
  beforeAll(async () => {
    app = await AppFactory.create();

    await AUTH_SERVICE.register(UserMock.getValidUserToCreate());
    user = (await USER_SERVICE.getUserByEmail(UserMock.getValidUserToCreate().email)) as IUser;

    await USER_SERVICE.markUserAsActive(user._id.toUUIDString());
    userLoginInfo = await AUTH_SERVICE.login(UserMock.getValidUserDataToLogin());

    twoFaSecret = (await TWO_FA_SERVICE.getTwoFaSecretIfNotSetup(
      user._id.toUUIDString(),
    )) as string;

    authToken = (
      await AUTH_SERVICE.verifyTwoFa(user._id.toUUIDString(), {
        code: TotpAuthenticator.getTotpCode(twoFaSecret),
      })
    ).token;
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Get user-profile with valid auth-token", async () => {
    const res = await request(app)
      .get("/me/profile")
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("active", true);
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("nationality");
    expect(res.body).toHaveProperty("verified", false);
  });

  //   it("[401] - Get user-profile with missing auth-token", async () => {
  //     let res = await request(app)
  //       .get("/me/profile")
  //       .expect(C.HttpStatusCode.UNAUTHENTICATED);
  //   });

  //   it("[401] - Get user-profile with invalid auth-token", async () => {
  //     let res = await request(app)
  //       .get("/me/profile")
  //       .set({ authorization: "Bearer INVALID-TOKEN", "Content-Type": "application/json" })
  //       .expect(C.HttpStatusCode.UNAUTHENTICATED);
  //   });
});
