import request from "supertest";
import { Application } from "express";
import C from "../../src/constants";
import AppFactory from "../__helpers__/app-factory.helper";

let app: Application;

describe("GET /health", () => {
  beforeAll(async () => {
    app = await AppFactory.create();
  });

  afterAll(async () => {
    await AppFactory.destroy();
  });

  it("[200] - Check that /health route is UP & running", async () => {
    const res = await request(app).get(`/health`).send({}).expect(C.HttpStatusCode.SUCCESS);

    expect(res.body.status).toEqual("UP");
  });
});
