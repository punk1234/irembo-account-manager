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
import config from "../../../src/config";

const USER_SERVICE = Container.get(UserService);
const AUTH_SERVICE = Container.get(AuthService);
const TWO_FA_SERVICE = Container.get(TwoFaService);

let app: Application;
let twoFaSecret: string, authToken: string, user: IUser;

describe("POST /me/password/change", () => {
  const newPassword = "New#Pass@123";

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
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200 & 401] - Change my password with valid auth-token & retry for 401 as token should have been invalidated", async () => {
    let res = await request(app)
      .post("/me/password/change")
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .send({
        password: UserMock.getValidUserToCreate().password,
        newPassword,
      })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("success", true);

    res = await request(app)
      .post("/me/password/change")
      .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
      .send({
        password: newPassword,
        newPassword: newPassword + "-Valid",
      })
      .expect(C.HttpStatusCode.UNAUTHENTICATED);
  });

  //   it("[400] - Change my password with empty request data", async () => {
  //     const res = await request(app)
  //       .post("/me/password/change")
  //       .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
  //       .send({})
  //       .expect(C.HttpStatusCode.BAD_REQUEST);

  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.data.errors).toHaveLength(2);
  //     expect(res.body.data.errors[0].path).toEqual("/body/password");
  //     expect(res.body.data.errors[1].path).toEqual("/body/newPassword");
  //   });

  //   it("[429] - Change my password severals times with failed attempts", async () => {
  //     const MAX_NO_OF_REQUEST_PLUS_ONE =
  //       config.API_RATE_LIMITING[C.ApiRateLimiterType.CHANGE_PASSWORD].limit + 1;

  //     const email = "change-password-rate-limit-email@rate.limit";

  //     await AUTH_SERVICE.register({ ...UserMock.getValidUserToCreate(), email });
  //     const user = (await USER_SERVICE.getUserByEmail(email)) as IUser;

  //     await USER_SERVICE.markUserAsActive(user._id.toUUIDString());

  //     const twoFaSecret = (await TWO_FA_SERVICE.getTwoFaSecretIfNotSetup(
  //       user._id.toUUIDString(),
  //     )) as string;

  //     authToken = (
  //       await AUTH_SERVICE.verifyTwoFa(user._id.toUUIDString(), {
  //         code: TotpAuthenticator.getTotpCode(twoFaSecret),
  //       })
  //     ).token;

  //     for (let requestNo = 1; requestNo <= MAX_NO_OF_REQUEST_PLUS_ONE; requestNo++) {
  //       const res = await request(app)
  //         .post("/me/password/change")
  //         .set({ authorization: `Bearer ${authToken}`, "Content-Type": "application/json" })
  //         .send({ password: UserMock.getValidUserToCreate().password + "@", newPassword });

  //       if (requestNo === MAX_NO_OF_REQUEST_PLUS_ONE) {
  //         expect(res.status).toBe(C.HttpStatusCode.TOO_MANY_REQUESTS);
  //       } else {
  //         expect(res.status).toBe(C.HttpStatusCode.UNAUTHENTICATED);
  //         expect(res.body).toHaveProperty("message", "Invalid user credentials!");
  //       }
  //     }
  //   });
});
