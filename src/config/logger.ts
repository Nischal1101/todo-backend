import winston from "winston";
import { Config } from "../config";

const logger = winston.createLogger({
    level: "info",
    defaultMeta: { service: "auth-service" },
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.File({
            level: "error",
            dirname: "logs",
            filename: "error.log",
            silent: Config.NODE_ENV === "test",
        }),
    ],
});

export default logger;
