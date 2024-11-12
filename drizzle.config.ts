import { defineConfig } from "drizzle-kit";
import { Config } from "./src/config";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: Config.DATABASE_URL as string,
    },
});
