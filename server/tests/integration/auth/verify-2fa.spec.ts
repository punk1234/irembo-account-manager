import request from "supertest";
import { Application } from "express";
import C from "../../../src/constants";
import { UserMock } from "../../__mocks__";
import AppFactory from "../../__helpers__/app-factory.helper";
import { UserService } from "../../../src/services/user.service";
import Container from "typedi";
import { IUser } from "../../../src/database/types/user.type";
import config from "../../../src/config";
import { AuthService } from "../../../src/services/auth.service";
import { EmailService } from "../../../src/services/external/email.service";
import { LoginResponse } from "../../../src/models";
import { TotpAuthenticator } from "../../../src/helpers";
import { TwoFaService } from "../../../src/services/two-fa.service";

const AUTH_SERVICE = Container.get(AuthService);
const USER_SERVICE = Container.get(UserService);
const TWO_FA_SERVICE = Container.get(TwoFaService);
const EMAIL_SERVICE = Container.get(EmailService);

let app: Application;
let user: IUser, requestSpy, userLoginInfo: LoginResponse;
let twoFaSecret: string;

describe("POST /auth/twoFa/verify", () => {
  beforeAll(async () => {
    app = await AppFactory.create();

    requestSpy = jest
      .spyOn(AUTH_SERVICE, "generateToken")
      .mockReturnValue(UserMock.getValidUserVerifyAccountToken());

    await AUTH_SERVICE.register(UserMock.getValidUserToCreate());
    user = (await USER_SERVICE.getUserByEmail(UserMock.getValidUserToCreate().email)) as IUser;
    await USER_SERVICE.markUserAsActive(user._id.toUUIDString());

    userLoginInfo = await AUTH_SERVICE.login(UserMock.getValidUserDataToLogin());
    twoFaSecret = (await TWO_FA_SERVICE.getTwoFaSecretIfNotSetup(
      user._id.toUUIDString(),
    )) as string;
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Verify 2FA with valid token & code", async () => {
    const res = await request(app)
      .post("/auth/twoFa/verify")
      .set({ authorization: `Bearer ${userLoginInfo.token}`, "Content-Type": "application/json" })
      .send({ code: TotpAuthenticator.getTotpCode(twoFaSecret) })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toEqual("string");
  });

    it("[400] - Verify 2FA with empty request object", async () => {
      const res = await request(app)
        .post("/auth/twoFa/verify")
        .send({})
        .expect(C.HttpStatusCode.BAD_REQUEST);

      expect(res.body).toHaveProperty("message");
      expect(res.body.data.errors).toHaveLength(1);
      expect(res.body.data.errors[0].path).toEqual("/body/code");
    });

    it("[400] - Verify 2FA with empty invalid code", async () => {
      const res = await request(app)
        .post("/auth/twoFa/verify")
        .send({ code: 12345 })
        .expect(C.HttpStatusCode.BAD_REQUEST);

      expect(res.body).toHaveProperty("message");
      expect(res.body.data.errors).toHaveLength(1);
      expect(res.body.data.errors[0].path).toEqual("/body/code");
    });

    it("[401] - Verify 2FA with mssing auth-token", async () => {
      const res = await request(app)
        .post("/auth/twoFa/verify")
        .set({ "Content-Type": "application/json" })
        .send({ code: TotpAuthenticator.getTotpCode(twoFaSecret) })
        .expect(C.HttpStatusCode.UNAUTHENTICATED);

        expect(res.body).toHaveProperty("message", "Invalid token!");
    });

    it("[401] - Verify 2FA with invalid code", async () => {
      userLoginInfo = await AUTH_SERVICE.login(UserMock.getValidUserDataToLogin());

      const res = await request(app)
        .post("/auth/twoFa/verify")
        .set({ authorization: `Bearer ${userLoginInfo.token}`, "Content-Type": "application/json" })
        .send({ code: "123456" })
        .expect(C.HttpStatusCode.UNAUTHENTICATED);

        expect(res.body).toHaveProperty("message", "2FA code is invalid");
    });

    it("[429] - Verify 2FA severals times with failed attempts", async () => {
      const MAX_NO_OF_REQUEST_PLUS_ONE =
        config.API_RATE_LIMITING[C.ApiRateLimiterType.VERIFY_2FA].limit + 1;

      const email = "verify-2fa-rate-limit-email@rate.limit";

      await AUTH_SERVICE.register({ ...UserMock.getValidUserToCreate(), email });
      const user = (await USER_SERVICE.getUserByEmail(email)) as IUser;

      await USER_SERVICE.markUserAsActive(user._id.toUUIDString());
      const userLoginInfo = await AUTH_SERVICE.login({ ...UserMock.getValidUserDataToLogin(), email});

      for (let requestNo = 1; requestNo <= MAX_NO_OF_REQUEST_PLUS_ONE; requestNo++) {
        const res = await request(app)
          .post("/auth/twoFa/verify")
          .set({ authorization: `Bearer ${userLoginInfo.token}`, "Content-Type": "application/json" })
          .send({ code: "000000" });

        if (requestNo === MAX_NO_OF_REQUEST_PLUS_ONE) {
          expect(res.status).toBe(C.HttpStatusCode.TOO_MANY_REQUESTS);
        } else {
          expect(res.status).toBe(C.HttpStatusCode.UNAUTHENTICATED);
          expect(res.body).toHaveProperty("message", "2FA code is invalid");
        }
      }
    });
});
