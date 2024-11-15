import { asc, desc, eq, like, or } from "drizzle-orm";
import { NextFunction, Response } from "express";
import logger from "../config/logger";
import db from "../db/db";
import { Files, Todos, Users } from "../db/schema";
import {
  IReturnResponse,
  ISearchQuery,
  ITodoDeleteRequest,
  ITodoRequest,
  IUpdateTodoRequest,
} from "../types";
import CustomErrorHandler from "../utils/CustomErrorHandler";

export const getAllTodos = async (
    req: ISearchQuery,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse: IReturnResponse;
    let todos;
    const { title: search, order } = req.query;
    if (order && !["asc", "desc"].includes(order)) {
        throw new CustomErrorHandler(
            400,
            "Invalid order parameter. Use 'asc' or 'desc'",
        );
    }
    const mySearch = String(search);
    try {
        todos = await db
            .select()
            .from(Todos)
            .where(search ? like(Todos.title, `%${mySearch}%`) : undefined)
            .orderBy(
                order === "asc" ? asc(Todos.createdAt) : desc(Todos.createdAt),
            );
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(400, "Error fetching all todos"),
            );
        else return next(new CustomErrorHandler(400, String(error)));
    }
    returnResponse = {
        message: "Successfully fetched all todos",
        data: todos,
        status: "success",
    };
    return res.status(200).json(returnResponse);
};

export const getIndividualTodo = async (
    req: ISearchQuery,
    res: Response,
    next: NextFunction,
) => {
    const userId = Number(req.user.sub);
    let returnResponse: IReturnResponse;
    let todos;
    const { title: search, order } = req.query;
    if (order && !["asc", "desc"].includes(order)) {
        throw new CustomErrorHandler(
            400,
            "Invalid order parameter. Use 'asc' or 'desc'",
        );
    }
    const mySearch = String(search);
    try {
        todos = await db
            .select({
                id: Todos.id,
                title: Todos.title,
                description: Todos.description,
                dueDate: Todos.dueDate,
                priority: Todos.priority,
                status: Todos.status,
                // userId: Todos.userId,
                createdAt: Todos.createdAt,
                updatedAt: Todos.updatedAt,
            })
            .from(Todos)
            .leftJoin(Users, eq(Todos.userId, Users.id))
            .where(
                or(
                    eq(Todos.userId, userId),
                    search ? like(Todos.title, `%${mySearch}%`) : undefined,
                ),
            )
            .orderBy(
                order === "asc" ? asc(Todos.createdAt) : desc(Todos.createdAt),
            );
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
        message: "Individual todo fetched Successfully",
        data: todos,
    };
    return res.status(200).json(returnResponse);
};
export const getSpecificTodo = async (
    req: ISearchQuery,
    res: Response,
    next: NextFunction,
) => {
    const { todoid: todoId } = req.params;
    let returnResponse: IReturnResponse;
    let todos;

    try {
        todos = await db
            .select()
            .from(Todos)
            .where(eq(Todos.id, Number(todoId)));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(400, "Error fetching individual todos"),
            );
        else return next(new CustomErrorHandler(400, String(error)));
    }

    logger.info("Specific todo has been fetched successfully ", {
        todoId,
    });
    returnResponse = {
        status: "success",
        message: "Specific todo fetched Successfully",
        data: todos[0],
    };
    return res.status(200).json(returnResponse);
};

export const createTodo = async (
    req: ITodoRequest,
    res: Response,
    next: NextFunction,
) => {
    const { title, description, dueDate, priority } = req.body;
    const date = new Date(dueDate);
    const { filename, path } = req.file as Express.Multer.File;

    const userId = Number(req.user.sub);
    let todo;
    let returnResponse: IReturnResponse;
    try {
        todo = await db
            .insert(Todos)
            .values({
                title,
                description,
                dueDate: date.toISOString(),
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

    await db
        .insert(Files)
        .values({ todoId: todo[0]?.id, fileName: filename, filePath: path });
    returnResponse = {
        data: todo[0],
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

    const toUpdate = {
        ...(title && { title }),
        ...(description && { description }),
        ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
        ...(priority && { priority }),
    };

    if (req.user.sub !== String(userId))
        return next(
            new CustomErrorHandler(403, "Lack of permission to modify todo"),
        );
    let updatedTodo;
    try {
        updatedTodo = await db
            .update(Todos)
            .set(toUpdate)
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

    if (!todoId) {
        return next(new CustomErrorHandler(400, "TodoId is required"));
    }
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
