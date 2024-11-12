import { Config } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

export const generateAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, Config.JWT_ACCESS_SECRET as string, {
        expiresIn: Config.ACCESS_TOKEN_EXPIRY_TIME as string,
    });
};
