import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import authenticate from "./../middlewares/authenticate";
import {
    getAllTodos,
    updateSpecificTodo,
    getIndividualTodo,
    deleteSpecificTodo,
    createTodo,
} from "../controllers/todo.controller";
const router = Router();

router.route("/").get(asyncErrorHandler(getAllTodos));

router
    .route("/:id")
    .get(authenticate, asyncErrorHandler(getIndividualTodo))
    .post(authenticate, asyncErrorHandler(createTodo))
    .delete(authenticate, asyncErrorHandler(deleteSpecificTodo))
    .put(authenticate, asyncErrorHandler(updateSpecificTodo));

export default router;
