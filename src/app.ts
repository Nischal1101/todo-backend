/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { urlencoded } from "express";
import error from "./middlewares/error";
import notFoundError from "./utils/notFoundError";
import authRouter from "./routes/auth.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { JwtPayload } from "jsonwebtoken";

const app = express();

app.use(cookieParser());
declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
            cookies: { accesstoken?: string };
        }
    }
}
app.use(cors({ credentials: true }));
app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use(error);
app.use("*", notFoundError);

export default app;
