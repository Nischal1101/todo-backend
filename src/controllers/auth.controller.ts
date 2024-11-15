import { NextFunction, Request, Response } from "express";
import {
    IRegisterUserRequest,
    IReturnResponse,
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
    let returnResponse: IReturnResponse;
    const { email, name, password } = req.body;
    let existingUser;
    try {
        existingUser = await db
            .select()
            .from(Users)
            .where(eq(Users.email, email));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(new CustomErrorHandler(400, error.message));
        else return next(new CustomErrorHandler(400, String(error)));
    }
    if (existingUser.length > 0) {
        return next(new CustomErrorHandler(400, "Email already exists"));
    }

    const hashedpw = await bcrypt.hash(password, 10);
    let user;
    try {
        user = await db
            .insert(Users)
            .values({ name, email, password: hashedpw })
            .returning();
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(new CustomErrorHandler(400, error.message));
        else return next(new CustomErrorHandler(400, String(error)));
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
    let returnResponse: IReturnResponse;
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
    return res
        .status(200)
        .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: false,
        })

        .json(returnResponse);
};

export const logoutUser = async (req: Request, res: Response) => {
    let returnResponse;
    returnResponse = {
        status: "success",
        message: "User logged out successfully",
        data: { userId: req.user.sub },
    };
    return res
        .status(200)
        .clearCookie("access_token", { httpOnly: true, secure: false })
        .json(returnResponse);
};

export const getSelf = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let returnResponse;
    let data;
    try {
        data = await db
            .select({ id: Users.id, email: Users.email, role: Users.role })
            .from(Users)
            .where(eq(Users.id, Number(req.user.sub)));
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(
                new CustomErrorHandler(400, "Error fetching self data"),
            );
        return next(new CustomErrorHandler(500, String(error)));
    }
    returnResponse = {
        status: "success",
        message: "self data fetched successfully",
        data: data[0],
    };
    return res
        .status(200)
        .clearCookie("access_token", { httpOnly: true, secure: false })
        .json(returnResponse);
};
