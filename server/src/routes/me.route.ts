import express from "express";
import { Container } from "typedi";
import { requireAuth } from "../middlewares";
import { UserController } from "../controllers/user.controller";

const router = express.Router();
const controller = Container.get(UserController);

router.get("/profile", requireAuth(), controller.getProfile);

export default router;
