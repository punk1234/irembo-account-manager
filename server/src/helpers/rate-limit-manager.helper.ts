import RedisConnector from "../database/connectors/redis.connector";
import { ApiRateLimiterType } from "../constants/api-rate-limiter-type.const";

/**
 * @class RateLimitManager
 */
export class RateLimitManager {
  static REDIS_RATE_LIMIT_LIB_PREFIX = "ratelimit:";

  /**
   * @method getAppKey
   * @static
   * @param {string} userId
   * @param {ApiRateLimiterType} rateLimitType
   * @returns {string}
   */
  static getAppKey(userId: string, rateLimitType: ApiRateLimiterType): string {
    if (!userId) {
      throw new Error("Invalid user identifier");
    }
    return `${rateLimitType}_${userId}`;
  }

  /**
   * @method getCacheKey
   * @static
   * @param {string} userId
   * @param {ApiRateLimiterType} rateLimitType
   * @returns {string}
   */
  static getCacheKey(userId: string, rateLimitType: ApiRateLimiterType): string {
    return RateLimitManager.REDIS_RATE_LIMIT_LIB_PREFIX + this.getAppKey(userId, rateLimitType);
  }

  /**
   * @method reset
   * @static
   * @param {string} userId
   * @param {ApiRateLimiterType} rateLimitType
   */
  static async reset(userId: string, rateLimitType: ApiRateLimiterType): Promise<void> {
    const redisClient = RedisConnector.getClient();
    if (!redisClient) {
      throw new Error();
    }

    await redisClient.del(this.getCacheKey(userId, rateLimitType));
  }
}
