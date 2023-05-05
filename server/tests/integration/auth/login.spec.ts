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

const AUTH_SERVICE = Container.get(AuthService);
const USER_SERVICE = Container.get(UserService);
const EMAIL_SERVICE = Container.get(EmailService);

let app: Application;
let user: IUser, requestSpy;

describe("POST /auth/login", () => {
  beforeAll(async () => {
    app = await AppFactory.create();

    requestSpy = jest
      .spyOn(AUTH_SERVICE, "generateToken")
      .mockReturnValue(UserMock.getValidUserVerifyAccountToken());

    await AUTH_SERVICE.register(UserMock.getValidUserToCreate());
    user = (await USER_SERVICE.getUserByEmail(UserMock.getValidUserToCreate().email)) as IUser;

    await USER_SERVICE.markUserAsActive(user._id.toUUIDString());
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Login user with valid data (with password)", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send(UserMock.getValidUserDataToLogin())
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("twoFaSetupCode");
    expect(typeof res.body.token).toEqual("string");
  });

  // it("[200] - Login user with valid data (passwordless)", async () => {
  //   const reqSpy = jest.spyOn(EMAIL_SERVICE, "sendPasswordlessLoginLink");

  //   const res = await request(app)
  //     .post("/auth/login")
  //     .send({ email: UserMock.getValidUserDataToLogin().email })
  //     .expect(C.HttpStatusCode.SUCCESS);

  //   expect(reqSpy).toHaveBeenCalledTimes(1);
  //   expect(res.body.isPasswordless).toEqual(true);
  // });

  // it("[400] - Login user with empty request object (with password)", async () => {
  //   const res = await request(app)
  //     .post("/auth/login")
  //     .send({})
  //     .expect(C.HttpStatusCode.BAD_REQUEST);

  //   expect(res.body).toHaveProperty("message");
  //   expect(res.body.data.errors).toHaveLength(1);
  //   expect(res.body.data.errors[0].path).toEqual("/body/email");
  //   // expect(res.body.data.errors[1].path).toEqual("/body/password");
  // });

  // it("[400] - Login user with invalid email & password request object (with password)", async () => {
  //   const res = await request(app)
  //     .post("/auth/login")
  //     .send(UserMock.getInvalidUserToLogin())
  //     .expect(C.HttpStatusCode.BAD_REQUEST);

  //   expect(res.body).toHaveProperty("message");
  //   expect(res.body.data.errors).toHaveLength(2);
  //   expect(res.body.data.errors[0].path).toEqual("/body/email");
  //   expect(res.body.data.errors[1].path).toEqual("/body/password");
  // });

  // it("[401] - Login user with invalid password", async () => {
  //   const res = await request(app)
  //     .post("/auth/login")
  //     .send({
  //       email: user.email,
  //       password: `${UserMock.getValidUserToCreate().password}-wrong`,
  //     })
  //     .expect(C.HttpStatusCode.UNAUTHENTICATED);

  //   expect(res.body).toHaveProperty("message", "Invalid user credentials!");
  // });

  // it("[401] - Login user with email that does not exist (confirm 404 is not returned for security)", async () => {
  //   const res = await request(app)
  //     .post("/auth/login")
  //     .send({ email: "user.email@not-found.com", password: "p@ssword" })
  //     .expect(C.HttpStatusCode.UNAUTHENTICATED);

  //   expect(res.body).toHaveProperty("message", "Invalid user credentials!");
  // });

  // it("[401] - Login user that has not verified account", async () => {
  //   const email = UserMock.getValidUserToCreate().email + "xyz"

  //   await AUTH_SERVICE.register({ ...UserMock.getValidUserToCreate(), email });

  //   const res = await request(app)
  //     .post("/auth/login")
  //     .send({ email, password: UserMock.getValidUserToCreate().password })
  //     .expect(C.HttpStatusCode.UNAUTHENTICATED);

  //   expect(res.body).toHaveProperty("message", "Invalid user credentials!");
  // });

  // it("[429] - Logging in severals times with failed attempts", async () => {
  //   const MAX_NO_OF_REQUEST_PLUS_ONE =
  //     config.API_RATE_LIMITING[C.ApiRateLimiterType.AUTH_LOGIN].limit + 1;

  //   const email = "login-rate-limit-email@rate.limit";

  //   await AUTH_SERVICE.register({ ...UserMock.getValidUserToCreate(), email });
  //   user = (await USER_SERVICE.getUserByEmail(email)) as IUser;

  //   for (let requestNo = 1; requestNo <= MAX_NO_OF_REQUEST_PLUS_ONE; requestNo++) {
  //     const res = await request(app)
  //       .post("/auth/login")
  //       .send({ email, password: `${UserMock.getValidUserToCreate().password}-wrong` });

  //     if (requestNo === MAX_NO_OF_REQUEST_PLUS_ONE) {
  //       expect(res.status).toBe(C.HttpStatusCode.TOO_MANY_REQUESTS);
  //     } else {
  //       expect(res.status).toBe(C.HttpStatusCode.UNAUTHENTICATED);
  //       expect(res.body).toHaveProperty("message", "Invalid user credentials!");
  //     }
  //   }
  // });
});
