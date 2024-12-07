// src/config/config-loader.ts

import { ConfigFactory } from "../factories/config-factory.js";
import { IConfig } from "../schemas/interfaces.js";
import fs from "fs";

// Function to load JSON config
const load_json_config = (filePath: string): IConfig => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

// Register the JSON loader with the ConfigFactory
ConfigFactory.registerConfigType("json", load_json_config);

export { load_json_config };
