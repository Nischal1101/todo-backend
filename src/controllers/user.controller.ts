import { NextFunction, Request, Response } from "express";
import db from "../db/db";
import { Users } from "../db/schema";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import { eq } from "drizzle-orm";
import { IReturnResponse } from "../types";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse: IReturnResponse;
    let users;
    try {
        users = await db.select().from(Users);
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(
                    400,
                    "Error fetching users from database",
                ),
            );
        return next(new CustomErrorHandler(500, String(error)));
    }
    returnResponse = {
        data: users,
        message: "Users successfully fetched",
        status: "success",
    };
    return res.status(200).json(returnResponse);
};
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse: IReturnResponse;
    const userId = Number(req.params.userid);
    try {
        await db.delete(Users).where(eq(Users.id, userId));
    } catch (error) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(
                    400,
                    "Error deleting user from database",
                ),
            );
        return next(new CustomErrorHandler(500, String(error)));
    }
    returnResponse = {
        data: { userId },
        message: "user deleted successfully",
        status: "success",
    };
    return res.status(200).json(returnResponse);
};
