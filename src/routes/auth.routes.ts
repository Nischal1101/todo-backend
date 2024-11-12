import { Router } from "express";
import asyncErrorHandler from "../utils/AsyncErrorHandler";
import { testAuth } from "../controllers/auth.controller";
const router = Router();

router.route("/test").get(asyncErrorHandler(testAuth));

export default router;
