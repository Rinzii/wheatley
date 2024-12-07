// src/config/common/database-config.ts

import { IDatabaseConfig } from "../schemas/interfaces.js";

// Ensure the critical database environment variables are provided
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_NAME) {
    throw new Error("Critical database environment variables are missing");
}

export const database_config: IDatabaseConfig = {
    name: "database-config",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10), // Default to 5432 if DB_PORT is not set
    database: process.env.DB_NAME,
};
