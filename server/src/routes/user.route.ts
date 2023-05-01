import express from "express";
import { Container } from "typedi";
import { requireAuth } from "../middlewares";
import { AccountVerificationController } from "../controllers/account-verification.controller";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

const userController = Container.get(UserController);
const verificationController = Container.get(AccountVerificationController);

router.put(
  "/:userId/account/verification/status",
  requireAuth({ forAdmin: true }),
  verificationController.updateAccountVerificationStatus,
);

router.get(
  "/verification-requests",
  requireAuth({ forAdmin: true }),
  verificationController.getAccountVerificationRequests,
);

router.get("", requireAuth({ forAdmin: true }), userController.getUsers);

export default router;
