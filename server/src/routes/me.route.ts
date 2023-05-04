import express from "express";
import { Container } from "typedi";
import C from "../constants";
import { UserController } from "../controllers/user.controller";
import { imageMimeTypeValidator, requireAuth, useRateLimit } from "../middlewares";
import { AccountVerificationController } from "../controllers/account-verification.controller";

const router = express.Router();

const controller = Container.get(UserController);
const verificationController = Container.get(AccountVerificationController);

router.get("/profile", requireAuth(), controller.getProfile);
router.patch("/profile", requireAuth(), imageMimeTypeValidator("photo"), controller.updateProfile);

router.post(
  "/password/change",
  requireAuth(),
  useRateLimit(C.ApiRateLimiterType.CHANGE_PASSWORD),
  controller.changePassword,
);

router.post(
  "/account/verification",
  requireAuth({ forAdmin: false }),
  imageMimeTypeValidator("images", true),
  verificationController.initiateAccountVerification,
);

router.get(
  "/account/verification",
  requireAuth({ forAdmin: false }),
  verificationController.getVerificationInfo,
);

export default router;
