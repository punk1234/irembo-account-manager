import Container from "typedi";
import request from "supertest";
import { Application } from "express";
import C from "../../../src/constants";
import { UserMock } from "../../__mocks__";
import { IdentificationType, LoginResponse } from "../../../src/models";
import AppFactory from "../../__helpers__/app-factory.helper";
import { UserService } from "../../../src/services/user.service";
import { AuthService } from "../../../src/services/auth.service";
import { IUser } from "../../../src/database/types/user.type";
import { TwoFaService } from "../../../src/services/two-fa.service";
import { TotpAuthenticator } from "../../../src/helpers";
import { FileManager } from "../../../src/services/external/file-manager.service";

const USER_SERVICE = Container.get(UserService);
const AUTH_SERVICE = Container.get(AuthService);
const TWO_FA_SERVICE = Container.get(TwoFaService);
const FILE_MANAGER = Container.get(FileManager);

let app: Application;
let user: IUser, userLoginInfo: LoginResponse;
let twoFaSecret: string, authToken: string, requestSpy;

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

    requestSpy = jest
      .spyOn(FILE_MANAGER, "uploadFile")
      .mockResolvedValue(UserMock.getProfileImageUrl());
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Get my verification info. with valid auth-token & no verification", async () => {
    const res = await request(app)
      .get("/me/account/verification")
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("success", false);
  });

    it("[200] - Get my verification info. with valid auth-token & verification", async () => {
      let res = await request(app)
        .post("/me/account/verification")
        .set({ authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" })
        .field("idType", IdentificationType.NID)
        .field("idNumber", "ABCD1234")
        .attach("images", `${__dirname}/../../__files__/upload-file.png`)
        .attach("images", `${__dirname}/../../__files__/upload-file.png`)
        .expect(C.HttpStatusCode.SUCCESS);

      res = await request(app)
        .get("/me/account/verification")
        .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
        .expect(C.HttpStatusCode.SUCCESS);

      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("idType", IdentificationType.NID);
      expect(res.body.data).toHaveProperty("idNumber", "ABCD1234");
      expect(res.body.data).toHaveProperty("status", "PENDING");
      expect(res.body.data.images).toHaveLength(2);
    });

      it("[401] - Get my verification info. with missing auth-token", async () => {
        let res = await request(app)
          .get("/me/account/verification")
          .expect(C.HttpStatusCode.UNAUTHENTICATED);
      });

      it("[401] - Get my verification info. with invalid auth-token", async () => {
        let res = await request(app)
          .get("/me/account/verification")
          .set({ authorization: "Bearer INVALID-TOKEN", "Content-Type": "application/json" })
          .expect(C.HttpStatusCode.UNAUTHENTICATED);
      });
});
