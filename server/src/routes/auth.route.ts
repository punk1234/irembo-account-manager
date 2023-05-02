import express from "express";
import { Container } from "typedi";
import C from "../constants";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth, useRateLimit } from "../middlewares";

const router = express.Router();
const controller = Container.get(AuthController);

router.post("/register", controller.register);
router.post("/login", useRateLimit(C.ApiRateLimiterType.AUTH_LOGIN), controller.login);

router.post("/logout", requireAuth(), controller.logout);

router.post(
  "/twoFa/verify",
  requireAuth({ tokenType: C.AuthTokenType.VERIFY_2FA }),
  useRateLimit(C.ApiRateLimiterType.VERIFY_2FA),
  controller.verifyTwoFa,
);

router.post(
  "/password/reset/send-link",
  useRateLimit(C.ApiRateLimiterType.GENERATE_RESET_TOKEN),
  controller.sendPasswordResetLink,
);
router.post(
  "/password/reset",
  useRateLimit(C.ApiRateLimiterType.RESET_PASSWORD),
  controller.resetPassword,
);

export default router;
