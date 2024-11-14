import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { getAllUsers, deleteUser } from "../controllers/user.controller";
import { admin } from "../middlewares/admin";
import authenticate from "./../middlewares/authenticate";
const router = Router();

router.route("/").get(authenticate, admin, asyncErrorHandler(getAllUsers));
router
    .route("/:userid")
    .delete(authenticate, admin, asyncErrorHandler(deleteUser));

export default router;
