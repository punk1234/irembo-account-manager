import RedisMock from "redis-mock";
import RedisConnector from "../../src/database/connectors/redis.connector";

/**
 * @class RedisTestConnector
 */
export default class RedisTestConnector extends RedisConnector {
  /**
   * @name connect
   * @desc connects to redis database
   */
  async connect(url: string) {
    console.log("Connection URL:", url);

    RedisConnector.setClient(RedisMock.createClient() as any);
    RedisTestConnector.client = RedisMock.createClient() as any;
  }
}
