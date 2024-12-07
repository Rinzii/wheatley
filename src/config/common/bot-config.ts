// src/config/common/bot-config.ts

import { IBotConfig } from "../schemas/interfaces.js";

if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN environment variable is required");
}

export const bot_config: IBotConfig = {
    name: "bot-config",
    token: process.env.BOT_TOKEN,
    owner: process.env.BOT_OWNER || "",
};
