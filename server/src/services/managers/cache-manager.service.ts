import { Service } from "typedi";
import RedisConnector from "../../database/connectors/redis.connector";

/**
 * @class CacheManager
 */
@Service()
export class CacheManager {
  private static DEFAULT_TTL = 1200; // 20 minutes;

  /**
   * @method set
   * @instance
   * @param {string} key
   * @param {string} value
   */
  set(key: string, value: string) {
    return RedisConnector.getClient().set(key, value);
  }

  /**
   * @method setWithExpiry
   * @instance
   * @param {string} key
   * @param {string} value
   * @param {number} ttl - in seconds
   */
  setWithExpiry(key: string, value: string, ttl?: number) {
    return RedisConnector.getClient().set(key, value, "EX", ttl || CacheManager.DEFAULT_TTL);
  }

  /**
   * @method get
   * @instance
   * @param {string} key
   * @return {Promise<any>}
   */
  get(key: string): Promise<any> {
    return RedisConnector.getClient().get(key);
  }

  /**
   * @method delete
   * @instance
   * @param {string} key
   */
  delete(key: string): Promise<any> {
    return RedisConnector.getClient().del(key);
  }
}
