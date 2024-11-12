import express from "express";
import error from "./middlewares/error";
import notFoundError from "./utils/notFoundError";

const app = express();


app.use("*", notFoundError);
app.use(error);

export default app;
