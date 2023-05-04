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

const AUTH_SERVICE = Container.get(AuthService);
const USER_SERVICE = Container.get(UserService);

let app: Application;
let user: IUser, requestSpy;

describe("POST /auth/password/reset", () => {
  beforeAll(async () => {
    app = await AppFactory.create();

    requestSpy = jest
      .spyOn(AUTH_SERVICE, "generateToken")
      .mockReturnValue(UserMock.getValidUserVerifyAccountToken());

    await AUTH_SERVICE.register(UserMock.getValidUserToCreate());
    user = (await USER_SERVICE.getUserByEmail(UserMock.getValidUserToCreate().email)) as IUser;
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Reset password with valid data", async () => {
    await AUTH_SERVICE.sendPasswordResetLink(user.email);

    const res = await request(app)
      .post("/auth/password/reset")
      .send({
        userId: user._id.toUUIDString(),
        token: UserMock.getValidUserVerifyAccountToken().value,
        password: UserMock.getValidUserToCreate().password,
      })
      .expect(C.HttpStatusCode.SUCCESS);

    expect(res.body).toHaveProperty("success", true);
  });

  //   it("[400] - Reset password with empty request object", async () => {
  //     const res = await request(app)
  //       .post("/auth/password/reset")
  //       .send({})
  //       .expect(C.HttpStatusCode.BAD_REQUEST);

  //     expect(res.body).toHaveProperty("message");
  //     expect(res.body.data.errors).toHaveLength(3);
  //     expect(res.body.data.errors[0].path).toEqual("/body/userId");
  //     expect(res.body.data.errors[1].path).toEqual("/body/token");
  //     expect(res.body.data.errors[2].path).toEqual("/body/password");
  //   });

  //   it("[401] - Reset password  with invalid token", async () => {
  //     const res = await request(app)
  //       .post("/auth/password/reset")
  //       .send({
  //         userId: user._id.toUUIDString(),
  //         token: `${UserMock.getValidUserVerifyAccountToken().value}-wrong`,
  //         password: UserMock.getValidUserToCreate().password
  //       })
  //       .expect(C.HttpStatusCode.UNAUTHENTICATED);

  //     expect(res.body).toHaveProperty("message", "Invalid user credentials!");
  //   });

  //   it("[429] - Reset password severals times with failed attempts", async () => {
  //     const MAX_NO_OF_REQUEST_PLUS_ONE =
  //       config.API_RATE_LIMITING[C.ApiRateLimiterType.RESET_PASSWORD].limit + 1;

  //     const email = "reset-password-rate-limit-email@rate.limit";

  //     await AUTH_SERVICE.register({ ...UserMock.getValidUserToCreate(), email });
  //     user = (await USER_SERVICE.getUserByEmail(email)) as IUser;

  //     for (let requestNo = 1; requestNo <= MAX_NO_OF_REQUEST_PLUS_ONE; requestNo++) {
  //       const res = await request(app)
  //         .post("/auth/password/reset")
  //         .send({
  //           userId: user._id.toUUIDString(),
  //           token: `${UserMock.getValidUserVerifyAccountToken().value}-wrong`,
  //           password: UserMock.getValidUserToCreate().password
  //         });

  //       if (requestNo === MAX_NO_OF_REQUEST_PLUS_ONE) {
  //         expect(res.status).toBe(C.HttpStatusCode.TOO_MANY_REQUESTS);
  //       } else {
  //         expect(res.status).toBe(C.HttpStatusCode.UNAUTHENTICATED);
  //         expect(res.body).toHaveProperty("message", "Invalid user credentials!");
  //       }
  //     }
  //   });
});
