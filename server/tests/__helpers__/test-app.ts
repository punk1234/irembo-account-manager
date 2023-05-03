import mongoose from "mongoose";
import App from "../../src/app";
import RedisTestConnector from "./redis-mock.helper";
import { MongoMemoryServer } from "mongodb-memory-server";
import MongoDbConnector from "../../src/database/connectors/mongodb.connector";

/**
 * @class TestApp
 */
export default class TestApp extends App {
  mongoTestServer!: MongoMemoryServer;

  /**
   * @method setupDependencies
   * @async
   */
  protected async setupDependencies(): Promise<void> {
    this.mongoTestServer = await MongoMemoryServer.create();
    this.mongoConnector = new MongoDbConnector(mongoose);

    await this.mongoConnector.connect(this.mongoTestServer.getUri());

    const redisConnector: RedisTestConnector = new RedisTestConnector();
    await redisConnector.connect("");
  }

  /**
   * @method close
   * @async
   */
  async close() {
    await RedisTestConnector.getClient().flushall();
    await RedisTestConnector.getClient().quit();

    this.mongoConnector.disconnect();
    await this.mongoTestServer.stop();

    super.close(false);
  }
}
