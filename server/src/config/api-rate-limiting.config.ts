import C from "../constants";

const { ApiRateLimiterType } = C;
const ONE_HOUR_WINDOW_IN_SECONDS = 3600;

export default {
  [ApiRateLimiterType.AUTH_LOGIN]: {
    window: ONE_HOUR_WINDOW_IN_SECONDS,
    limit: 3,
  },
  [ApiRateLimiterType.GENERATE_RESET_TOKEN]: {
    window: ONE_HOUR_WINDOW_IN_SECONDS,
    limit: 5,
  },
  [ApiRateLimiterType.RESET_PASSWORD]: {
    window: ONE_HOUR_WINDOW_IN_SECONDS,
    limit: 3,
  },
  [ApiRateLimiterType.CHANGE_PASSWORD]: {
    window: ONE_HOUR_WINDOW_IN_SECONDS,
    limit: 5,
  },
  [ApiRateLimiterType.VERIFY_RESET_TOKEN]: {
    window: ONE_HOUR_WINDOW_IN_SECONDS,
    limit: 5,
  },
};
