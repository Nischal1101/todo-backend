import express from "express";
import error from "./middlewares/error";
import notFoundError from "./utils/notFoundError";
import authRouter from "./routes/auth.routes";

const app = express();

app.use("/api/auth", authRouter);
app.use(error);
app.use("*", notFoundError);

export default app;
