import Container from "typedi";
import request from "supertest";
import { Application } from "express";
import C from "../../../src/constants";
import { UserMock } from "../../__mocks__";
import AppFactory from "../../__helpers__/app-factory.helper";
import { UserService } from "../../../src/services/user.service";
import { AuthService } from "../../../src/services/auth.service";
import { IUser } from "../../../src/database/types/user.type";
import { TwoFaService } from "../../../src/services/two-fa.service";
import { TotpAuthenticator } from "../../../src/helpers";
import { IdentificationType } from "../../../src/models";
import { FileManager } from "../../../src/services/external/file-manager.service";

const USER_SERVICE = Container.get(UserService);
const AUTH_SERVICE = Container.get(AuthService);
const TWO_FA_SERVICE = Container.get(TwoFaService);
const FILE_MANAGER = Container.get(FileManager);

let app: Application;
let twoFaSecret: string, authToken: string, user: IUser, requestSpy;

describe("POST /me/account/verification", () => {
  beforeAll(async () => {
    app = await AppFactory.create();

    await AUTH_SERVICE.register(UserMock.getValidUserToCreate());
    user = (await USER_SERVICE.getUserByEmail(UserMock.getValidUserToCreate().email)) as IUser;

    await USER_SERVICE.markUserAsActive(user._id.toUUIDString());

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

  it("[200] - Initiate verification-request", async () => {
    const res = await request(app)
      .post("/me/account/verification")
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" })
      .field("idType", IdentificationType.NID)
      .field("idNumber", "ABCD1234")
      .attach("images", `${__dirname}/../../__files__/upload-file.png`)
      .attach("images", `${__dirname}/../../__files__/upload-file.png`)
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("idType", IdentificationType.NID);
    expect(res.body).toHaveProperty("idNumber", "ABCD1234");
    expect(res.body).toHaveProperty("status", "PENDING");
    expect(res.body.images).toHaveLength(2);
  });

    it("[400] - Initiate verification-request with empty request data", async () => {
      const res = await request(app)
        .post("/me/account/verification")
        .set({ authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" })
        .send()
        .expect(C.HttpStatusCode.BAD_REQUEST);

      expect(res.body).toHaveProperty("message");
    });

    it("[401] - Initiate verification-request with invalid token", async () => {
      const res = await request(app)
        .post("/me/account/verification")
        .set({ authorization: "Bearer INVALID-TOKEN", "Content-Type": "multipart/form-data" })
        .field("idType", IdentificationType.NID)
        .field("idNumber", "ABCD1234")
        .attach("images", `${__dirname}/../../__files__/upload-file.png`)
        .attach("images", `${__dirname}/../../__files__/upload-file.png`)
        .expect(C.HttpStatusCode.UNAUTHENTICATED);

      expect(res.body).toHaveProperty("message");
    });
});
