import C from "../constants";
import { config as getEnvVariables } from "dotenv";
import apiRateLimitingConfig from "./api-rate-limiting.config";

getEnvVariables();

const { env } = process;

/** Defaults to 90secs -> 90,000millisec -> 1.5mins to  */
const AUTH_2FA_TOKEN_TTL_IN_MILLISECS = (env.AUTH_TOKEN_TTL_IN_SECS || "90") + "000";

export default {
  PORT: Number(env.PORT || 8000),
  ENVIRONMENT: env.NODE_ENV || C.Environment.DEVELOPMENT,
  MONGODB_URL: env.MONGODB_URL || "",
  REDIS_URL: env.REDIS_URL || "",
  JWT_TOKEN_SECRET: env.JWT_TOKEN_SECRET || "",
  AUTH_TOKEN_TTL_IN_HOURS: `${env.AUTH_TOKEN_TTL_IN_HOURS || "6"}h`,
  AUTH_2FA_TOKEN_TTL_IN_MILLISECS,

  TOTP_ISSUER_NAME: "Irembo Auth",
  TWO_FA_CRYPTO_SECRET: env.TWO_FA_CRYPTO_SECRET || "", // HANDLE MISSING env AS THIS IS CRITICAL

  WEB_APP_URL: env.WEB_APP_URL || "https://web.irembo.app",

  EMAIL_NAME: env.EMAIL_NAME || "",
  EMAIL_PASSWORD: env.EMAIL_PASSWORD || "",

  CLOUDINARY: {
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  },

  VERIFICATION_DOCS_BUCKET: "account-vrfy-docs",
  PROFILE_PHOTO_BUCKET: "profile-photos",

  API_RATE_LIMITING: apiRateLimitingConfig,

  SUPER_ADMIN_EMAIL: env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: env.SUPER_ADMIN_PASSWORD,
};
