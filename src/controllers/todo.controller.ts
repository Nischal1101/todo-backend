import { NextFunction, Request, Response } from "express";
import db from "../db/db";
import { Todos, Users } from "../db/schema";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import { eq } from "drizzle-orm";
import { IReturnResponse, ITodoDeleteRequest, ITodoRequest, IUpdateTodoRequest } from "../types";
import logger from "../config/logger";

export const getAllTodos = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await db.select().from(Todos);
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(400, "Error fetching all todos"),
            );
        else return next(new CustomErrorHandler(400, String(error)));
    }
};

export const getIndividualTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const userId = Number(req.user.sub);
    let returnResponse: IReturnResponse;
    let todos;
    try {
        todos = await db
            .select()
            .from(Todos)
            .leftJoin(Users, eq(Todos.id, Users.id))
            .where(eq(Todos.userId, userId));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(400, "Error fetching individual todos"),
            );
        else return next(new CustomErrorHandler(400, String(error)));
    }
    logger.info("Individual todos has been fetched successfully ", {
        userId,
    });
    returnResponse = {
        status: "success",
        message: "User registered Successfully",
        data: todos,
    };
    return res.status(201).json(returnResponse);
};

export const createTodo = async (
    req: ITodoRequest,
    res: Response,
    next: NextFunction,
) => {
    const { title, description, dueDate, priority } = req.body;
    const userId = Number(req.user.sub);
    let todo;
    let returnResponse: IReturnResponse;
    try {
        todo = await db
            .insert(Todos)
            .values({
                title,
                description,
                dueDate: dueDate.toISOString(),
                userId,
                priority,
            })
            .returning();
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(
                    400,
                    "Error creating todo in the database",
                ),
            );

        return next(new CustomErrorHandler(500, String(error)));
    }
    returnResponse = {
        data: todo,
        message: "Todo created successfully",
        status: "success",
    };
    return res.status(201).json(returnResponse);
};

export const updateSpecificTodo = async (
    req: IUpdateTodoRequest,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse: IReturnResponse;
    const todoId = Number(req.params.id);
    if (!todoId) {
        return next(new CustomErrorHandler(400, "TodoId is required"));
    }
    const { title, description, dueDate, priority, userId } = req.body;
    if (req.user.sub !== String(userId))
        return next(
            new CustomErrorHandler(403, "Lack of permission to modify todo"),
        );
    let updatedTodo;
    try {
        updatedTodo = await db
            .update(Todos)
            .set({
                title,
                description,
                dueDate: dueDate?.toISOString(),
                priority,
            })
            .where(eq(Todos.id, todoId))
            .returning({ updatedId: Users.id }); // This returns the updated row(s)

        if (!updatedTodo.length) {
            return next(new CustomErrorHandler(404, "Todo not found"));
        }
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(
                    500,
                    "An error occurred while updating the todo",
                ),
            );
        return next(new CustomErrorHandler(500, String(error)));
    }
    returnResponse = {
        data: updatedTodo[0],
        message: "Todo created successfully",
        status: "success",
    };
    return res.status(201).json(returnResponse);
};

export const deleteSpecificTodo = async (
    req: ITodoDeleteRequest,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse: IReturnResponse;
    const todoId = Number(req.params.id);
    const { userId } = req.body;

    if (!todoId) {
        return next(new CustomErrorHandler(400, "TodoId is required"));
    }
    if (req.user.sub !== String(userId))
        return next(
            new CustomErrorHandler(403, "Lack of permission to modify todo"),
        );
    try {
        await db.delete(Todos).where(eq(Todos.id, todoId));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(
                    500,
                    "An error occurred while deleting the todo",
                ),
            );
        return next(new CustomErrorHandler(500, String(error)));
    }
    returnResponse = {
        data: {},
        message: "Todo deleted successfully",
        status: "success",
    };
    return res.status(201).json(returnResponse);
};
