import { ResponseHandler } from "../helpers";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return ResponseHandler.ok(res, { message: "Welcome to GOMONEY Football League-Manager!" });
});

router.get("/health", (_req: Request, res: Response) => {
  return ResponseHandler.ok(res, { status: "UP" });
});

export default router;
