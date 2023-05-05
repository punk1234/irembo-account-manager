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
import { FileManager } from "../../../src/services/external/file-manager.service";
import { runDbSeeders } from "../../../src/database/seeders";

const USER_SERVICE = Container.get(UserService);
const AUTH_SERVICE = Container.get(AuthService);
const TWO_FA_SERVICE = Container.get(TwoFaService);
const FILE_MANAGER = Container.get(FileManager);

let app: Application;
let user: IUser, userLoginInfo: LoginResponse;
let twoFaSecret: string, authToken: string, requestSpy;

describe("PUT /me/account/verification/status", () => {
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

    requestSpy = jest
      .spyOn(FILE_MANAGER, "uploadFile")
      .mockResolvedValue(UserMock.getProfileImageUrl());

    await runDbSeeders();
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Get verification requests with valid auth-token", async () => {
    const ADMIN = (await USER_SERVICE.getUserByEmail(
      process.env.SUPER_ADMIN_EMAIL as string,
    )) as IUser;

    twoFaSecret = (await TWO_FA_SERVICE.getTwoFaSecretIfNotSetup(
      ADMIN._id.toUUIDString(),
    )) as string;

    const authToken = (
      await AUTH_SERVICE.verifyTwoFa(ADMIN._id.toUUIDString(), {
        code: TotpAuthenticator.getTotpCode(twoFaSecret),
      })
    ).token;

    const res = await request(app)
      .get(`/users`)
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body.records).toHaveLength(2);
    expect(res.body).toHaveProperty("page", 1);
    expect(res.body).toHaveProperty("limit", 10);
  });

  it("[400] - Get users with invalid query-param", async () => {
    const res = await request(app)
      .get(`/users?page=UNKNOWN`)
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .send({})
      .expect(C.HttpStatusCode.BAD_REQUEST);
  });

  it("[401] - Get users status with invalid auth-token", async () => {
    const res = await request(app)
      .get(`/users`)
      .set({ authorization: "Bearer INVALID-TOKEN", "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.UNAUTHENTICATED);
  });

  it("[403] - Get users with non-admin auth-token", async () => {
    const res = await request(app)
      .get(`/users`)
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.UNAUTHORIZED);
  });
});
