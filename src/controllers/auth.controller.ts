import { NextFunction, Request, Response } from "express";
import { RegisterUserRequest, ReturnResponse } from "../types";
import db from "../db/db";
import { Users } from "../db/schema";
import { eq, like } from "drizzle-orm";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import bcrypt from "bcrypt";
import logger from "../config/logger";

export const registerUser = async (
    req: RegisterUserRequest,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse: ReturnResponse;
    const { email, name, password } = req.body;
    const role = req.body.role || "user";

    let existingUser;
    try {
        existingUser = await db
            .select()
            .from(Users)
            .where(eq(Users.email, email));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(new CustomErrorHandler(400, error.message));
        else return next(new CustomErrorHandler(400, "something went wrong!"));
    }
    if (existingUser) {
        return next(new CustomErrorHandler(400, "Email already exists"));
    }

    const hashedpw = await bcrypt.hash(password, 10);
    let user;
    try {
        user = await db
            .insert(Users)
            .values({ name, email, password: hashedpw, role })
            .returning();
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(new CustomErrorHandler(400, error.message));
        else return next(new CustomErrorHandler(400, "something went wrong!"));
    }
    logger.info("User has been registered successfully ", {
        id: user[0]?.id,
    });
    returnResponse = {
        status: "success",
        message: "User registered Successfully",
        data: { id: user[0]?.id },
    };
    return res.status(201).json(returnResponse);
};

export const loginUser = async (req: Request, res: Response) => {
    res.json("hi test");
};
