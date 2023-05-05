import request from "supertest";
import { Application } from "express";
import C from "../../../src/constants";
import { UserMock } from "../../__mocks__";
import AppFactory from "../../__helpers__/app-factory.helper";
import Container from "typedi";
import { AuthService } from "../../../src/services/auth.service";
import { UserService } from "../../../src/services/user.service";
import { IUser } from "../../../src/database/types/user.type";
import { EmailService } from "../../../src/services/external/email.service";
import config from "../../../src/config";

const AUTH_SERVICE = Container.get(AuthService);
const USER_SERVICE = Container.get(UserService);
const EMAIL_SERVICE = Container.get(EmailService);

let app: Application;
let requestSpy;

describe("POST /auth/password/reset/send-link", () => {
  beforeAll(async () => {
    app = await AppFactory.create();

    requestSpy = jest
      .spyOn(AUTH_SERVICE, "generateToken")
      .mockReturnValue(UserMock.getValidUserVerifyAccountToken());

    await AUTH_SERVICE.register(UserMock.getValidUserToCreate());
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Send password reset-link to user with existing email", async () => {
    const reqSpy = jest.spyOn(EMAIL_SERVICE, "sendPasswordResetLink");

    const res = await request(app)
      .post("/auth/password/reset/send-link")
      .send({ email: UserMock.getValidUserToCreate().email })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("message", "Check your mail for reset-link!");
    expect(reqSpy).toHaveBeenCalledTimes(1);

    reqSpy.mockRestore();
  });

  //   it("[200] - Send password reset-link with email that does not exist (confirm it does not return 404)", async () => {
  //     const reqSpy = jest.spyOn(EMAIL_SERVICE, "sendPasswordResetLink");

  //     const res = await request(app)
  //       .post("/auth/password/reset/send-link")
  //       .send({ email: "send-password-reset-link@does-not-exist.com" })
  //       .expect(C.HttpStatusCode.SUCCESS);

  //     expect(res.body).toHaveProperty("message", "Check your mail for reset-link!");
  //     expect(reqSpy).toHaveBeenCalledTimes(0);
  //   });

  //   it("[400] - Send password reset-link with empty request object", async () => {
  //     const res = await request(app)
  //       .post("/auth/password/reset/send-link")
  //       .send({})
  //       .expect(C.HttpStatusCode.BAD_REQUEST);

  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.data.errors).toHaveLength(1);
  //     expect(res.body.data.errors[0].path).toEqual("/body/email");
  //   });

  //   it("[400] - Send password reset-link with invalid email in request object", async () => {
  //     const res = await request(app)
  //       .post("/auth/password/reset/send-link")
  //       .send({ email: "abcde-12345" })
  //       .expect(C.HttpStatusCode.BAD_REQUEST);

  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.data.errors).toHaveLength(1);
  //     expect(res.body.data.errors[0].path).toEqual("/body/email");
  //   });

  //   it("[429] - Send password reset-link severals times", async () => {
  //     const MAX_NO_OF_REQUEST_PLUS_ONE =
  //       config.API_RATE_LIMITING[C.ApiRateLimiterType.GENERATE_RESET_TOKEN].limit + 1;

  //     const email = "send-pwd-reset-link-rate-limit-email@rate.limit";

  //     for (let requestNo = 1; requestNo <= MAX_NO_OF_REQUEST_PLUS_ONE; requestNo++) {
  //       const res = await request(app)
  //         .post("/auth/password/reset/send-link")
  //         .send({ email });

  //       if (requestNo === MAX_NO_OF_REQUEST_PLUS_ONE) {
  //         expect(res.status).toBe(C.HttpStatusCode.TOO_MANY_REQUESTS);
  //       } else {
  //         expect(res.status).toBe(C.HttpStatusCode.SUCCESS);
  //         expect(res.body).toHaveProperty("message", "Check your mail for reset-link!");
  //       }
  //     }
  //   });
});
