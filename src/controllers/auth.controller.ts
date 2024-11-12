import { NextFunction, Response } from "express";
import {
    IRegisterUserRequest,
    ReturnResponse,
    ILoginUserRequest,
} from "../types";
import db from "../db/db";
import { Users } from "../db/schema";
import { eq } from "drizzle-orm";
import CustomErrorHandler from "../utils/CustomErrorHandler";
import bcrypt from "bcrypt";
import logger from "../config/logger";
import { JwtPayload } from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateTokens";

export const registerUser = async (
    req: IRegisterUserRequest,
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
    if (existingUser.length > 0) {
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

export const loginUser = async (
    req: ILoginUserRequest,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse: ReturnResponse;
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await db
            .select()
            .from(Users)
            .where(eq(Users.email, email));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(new CustomErrorHandler(400, error.message));
        else return next(new CustomErrorHandler(500, "something went wrong!"));
    }

    if (existingUser.length === 0) {
        return next(new CustomErrorHandler(400, "User doesn't exist"));
    }
    const match = await bcrypt.compare(password, existingUser[0].password);
    if (!match) {
        return next(new CustomErrorHandler(400, "Incorrect User credentials"));
    }

    const payload: JwtPayload = {
        sub: String(existingUser[0].id),
        role: existingUser[0].role,
    };
    const accessToken = generateAccessToken(payload);

    returnResponse = {
        status: "success",
        message: "User logged in successfully",
        data: existingUser[0],
        token: { accessToken },
    };
    res.cookie("access_token", accessToken, { httpOnly: true })
        .status(200)
        .json(returnResponse);
};
