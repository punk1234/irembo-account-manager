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
import { FileManager } from "../../../src/services/external/file-manager.service";

const USER_SERVICE = Container.get(UserService);
const AUTH_SERVICE = Container.get(AuthService);
const TWO_FA_SERVICE = Container.get(TwoFaService);
const FILE_MANAGER = Container.get(FileManager);

let app: Application;
let user: IUser, requestSpy;
let twoFaSecret: string, authToken: string;

describe("PATCH /me/profile", () => {
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

  it("[200] - Update my-profile with valid auth-token", async () => {
    const res = await request(app)
      .patch("/me/profile")
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" })
      .field("firstName", "fn")
      .field("lastName", "ln")
      .field("gender", "MALE")
      .field("maritalStatus", "SINGLE")
      .field("dateOfBirth", "2001-01-01")
      .field("nationality", "NG")
      .attach("photo", `${__dirname}/../../__files__/upload-file.png`)
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("firstName", "fn");
    expect(res.body).toHaveProperty("lastName", "ln");
    expect(res.body).toHaveProperty("gender", "MALE");
    expect(res.body).toHaveProperty("active", true);
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("nationality", "NG");
    expect(res.body).toHaveProperty("maritalStatus", "SINGLE");
  });

  //   it("[200] - Update my-profile without photo", async () => {
  //     const res = await request(app)
  //       .patch("/me/profile")
  //       .set({ authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" })
  //       .field("lastName", "last")
  //       .field("gender", "MALE")
  //       .expect(C.HttpStatusCode.SUCCESS);

  //     expect(res.body).toHaveProperty("lastName", "last");
  //     expect(res.body).toHaveProperty("gender", "MALE");
  //   });

  //   it("[400] - Update my-profile with empty request data", async () => {
  //     const res = await request(app)
  //       .patch("/me/profile")
  //       .set({ authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" })
  //       .send()
  //       .expect(C.HttpStatusCode.BAD_REQUEST);
  //   });

  //   it("[400] - Update my-profile with disallowed fields", async () => {
  //     const res = await request(app)
  //       .patch("/me/profile")
  //       .set({ authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" })
  //       .field("active", true)
  //       .field("verified", true)
  //       .field("isAdmin", true)
  //       .expect(C.HttpStatusCode.BAD_REQUEST);

  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.data.errors).toHaveLength(3);
  //     expect(res.body.data.errors[0].path).toEqual("/body/active");
  //     expect(res.body.data.errors[1].path).toEqual("/body/verified");
  //     expect(res.body.data.errors[2].path).toEqual("/body/isAdmin");
  //   });
});
