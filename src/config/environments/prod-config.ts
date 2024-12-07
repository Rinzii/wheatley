// src/config/environments/prod-config.ts

import { IServerConfig } from "../schemas/interfaces.js";

// Ensure the required environment variables for production are set
if (!process.env.PROD_SERVER_ID || !process.env.PROD_SERVER_NAME) {
    throw new Error("Required environment variables for production are missing");
}

export const prod_config: IServerConfig = {
    name: "prod-config",
    serverId: process.env.PROD_SERVER_ID,
    serverName: process.env.PROD_SERVER_NAME,
};
