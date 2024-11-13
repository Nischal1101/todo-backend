import express, { urlencoded } from "express";
import error from "./middlewares/error";
import notFoundError from "./utils/notFoundError";
import authRouter from "./routes/auth.routes";
import cors from "cors";

const app = express();

app.use(cors({ credentials: true }));
app.use(urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use(error);
app.use("*", notFoundError);

export default app;
