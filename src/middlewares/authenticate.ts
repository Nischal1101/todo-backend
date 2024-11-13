import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Config } from "../config";
import CustomErrorHandler from "../utils/CustomErrorHandler";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token1 = (req.cookies as { access_token?: string })?.access_token;
        const token2 = req.header("Authorization")?.split(" ")[1];

        const access_token = token1 || token2;
        if (!access_token) {
            return next(new CustomErrorHandler(401, "Unauthorized"));
        }
        jwt.verify(
            access_token,
            Config.JWT_ACCESS_SECRET!,
            (
                err: jwt.VerifyErrors | null,
                decoded: jwt.JwtPayload | string | undefined,
            ) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return next(
                            new CustomErrorHandler(401, "Token expired"),
                        );
                    } else {
                        return next(new CustomErrorHandler(403, "forbidden"));
                    }
                }

                req.user = decoded as JwtPayload;
            },
        );

        next();
    } catch (error: unknown) {
        if (error instanceof CustomErrorHandler)
            return next(new CustomErrorHandler(500, error.message));
        else return next(new CustomErrorHandler(500, String(error)));
    }
};

export default authenticate;
