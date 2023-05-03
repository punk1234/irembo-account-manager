import config from "../config";
import { RateLimitManager } from "../helpers";
import rateLimiter, { Options } from "redis-rate-limiter";
import { NextFunction, Request, Response } from "express";
import RedisConnector from "../database/connectors/redis.connector";
import { ApiRateLimiterType } from "../constants/api-rate-limiter-type.const";

/**
 * @function userRateLimit
 * @param {ApiRateLimiterType} rateLimiterType
 * @returns {Function}
 */
export const useRateLimit = (rateLimiterType: ApiRateLimiterType) => {
  const RATE_LIMIT_CONFIG = config.API_RATE_LIMITING[rateLimiterType];

  const getRedisKey = (userId: string) => {
    return RateLimitManager.getAppKey(userId, rateLimiterType);
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rateLimiterConfig: Options = {
        redis: RedisConnector.getClient() as any,

        // NOTE: USE `userId` WHEN MORE FUNCTIONALITIES ARE SUPPORTED.
        // ALSO, MAYBE SUPPORT `IP-ADDRESS` FOR UNIQUE-KEY
        key: (req: Request) =>
          getRedisKey(req.auth?.userId || req.body.email?.toLowerCase() || req.body.userId),
        ...RATE_LIMIT_CONFIG,
      };

      rateLimiter.middleware(rateLimiterConfig)(req, res, next);
    } catch (err: any) {
      next(err);
    }
  };
};
