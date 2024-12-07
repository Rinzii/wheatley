// src/config/environments/dev-config.ts

import { IServerConfig } from "../schemas/interfaces.js";

// Ensure the environment variables are available
if (!process.env.DEV_SERVER_ID || !process.env.DEV_SERVER_NAME) {
    throw new Error("DEV_SERVER_ID and DEV_SERVER_NAME environment variables are required for dev environment");
}

export const dev_config: IServerConfig = {
    name: "dev-config",
    serverId: process.env.DEV_SERVER_ID,
    serverName: process.env.DEV_SERVER_NAME,
};
