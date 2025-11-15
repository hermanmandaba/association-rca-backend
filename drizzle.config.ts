import { config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();


export default {
    schema: './src/db/schemas/*',
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
} satisfies config;