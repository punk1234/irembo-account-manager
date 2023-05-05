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

describe("POST /auth/logout", () => {
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

  it("[200] - User with auth-token can logout successfully & not access auth endpoints with token", async () => {
    let res = await request(app)
      .post("/auth/logout")
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("success", true);

    res = await request(app)
      .post("/auth/logout")
      .set({ authorization: `Bearer ${userLoginInfo.token}`, "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.UNAUTHENTICATED);

    expect(res.body).toHaveProperty("message", C.ResponseMessage.ERR_UNAUTHENTICATED);
  });

  it("[401] - Logging out without token fails", async () => {
    const res = await request(app).post("/auth/logout").expect(C.HttpStatusCode.UNAUTHENTICATED);

    expect(res.body).toHaveProperty("message", "Invalid token!");
  });

  it("[401] - Logging out with invalid token fails", async () => {
    await request(app)
      .post("/auth/logout")
      .set({ authorization: `Bearer INVALID_TOKEN`, "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.UNAUTHENTICATED);
  });
});
