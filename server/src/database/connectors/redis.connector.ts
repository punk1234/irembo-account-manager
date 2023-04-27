import Redis from "ioredis";
import { IDatabaseConnector } from "../../interfaces";

/**
 * @class RedisConnector
 */
export default class RedisConnector implements IDatabaseConnector {
  protected static client: Redis;

  /**
   * @name getClient
   * @static
   * @memberof RedisConnector
   * @returns {*}
   */
  static getClient(): Redis {
    return this.client;
  }

  /**
   * @name setClient
   * @static
   * @memberof RedisConnector
   * @param client
   */
  static setClient(client: Redis) {
    this.client = client;
  }

  /**
   * @instance
   * @name connect
   * @param url
   * @memberof RedisConnector
   * @desc connects to redis database
   */
  async connect(url: string) {
    // uses redis://127.0.0.1:6379 if url is empty string
    RedisConnector.client = await new Redis(url);
  }

  /**
   * @instance
   * @name disconnect
   * @memberof RedisConnector
   * @desc disconnects from redis database
   */
  async disconnect() {
    await RedisConnector.client?.disconnect();
  }
}
