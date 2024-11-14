import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import authenticate from "./../middlewares/authenticate";
import validate from "./../middlewares/validator";
import {
    loginUser,
    logoutUser,
    registerUser,
    getSelf,
} from "../controllers/auth.controller";
import { RegisterSchema } from "../utils/validators/RegisterSchema";
import { LoginSchema } from "../utils/validators/LoginSchema";
const router = Router();

router.route("/self").get(authenticate, asyncErrorHandler(getSelf));
router
    .route("/register")
    .post(validate(RegisterSchema), asyncErrorHandler(registerUser));
router
    .route("/login")
    .post(validate(LoginSchema), asyncErrorHandler(loginUser));
router.route("/logout").post(authenticate, asyncErrorHandler(logoutUser));

export default router;
