import { ConfigFactory } from "../factories/config-factory.js";
import { IConfig, IServerConfig, IDatabaseConfig, IBotConfig } from "./interfaces.js";
import { dev_config } from "../environments/dev-config.js";
import { prod_config } from "../environments/prod-config.js";
import { database_config } from "../common/database-config.js";
import fs from "fs";
import path from "path";

// Main class for handling configuration loading
class ConfigSystem {
    // Load configuration based on the environment or a specific type
    static loadConfig<T extends IConfig>(type: string, filePath: string): T {
        // Load the config using ConfigFactory
        return ConfigFactory.loadConfig<T>(type, filePath);
    }

    // Load environment-specific configurations based on the current environment
    static loadEnvironmentConfig(env: string): IConfig {
        switch (env) {
            case "development":
                return dev_config;
            case "production":
                return prod_config;
            default:
                throw new Error(`Unsupported environment: ${env}`);
        }
    }

    // Load database configuration from environment variables or a config file
    static loadDatabaseConfig(): IDatabaseConfig {
        const db_config = ConfigFactory.loadConfig<IDatabaseConfig>(
            "json",
            this.findConfigFile("database-config.json"),
        );

        if (!db_config.host || !db_config.port) {
            throw new Error("Database configuration is missing critical fields like host or port.");
        }

        return db_config;
    }

    // Load bot configuration
    static loadBotConfig(): IBotConfig {
        const bot_config = ConfigFactory.loadConfig<IBotConfig>("json", this.findConfigFile("bot-config.json"));

        if (!bot_config.token || !bot_config.owner) {
            throw new Error("Bot configuration is missing critical fields like token or owner.");
        }

        return bot_config;
    }

    // Add additional helper methods if needed
    static loadAllConfigs(env: string) {
        const environment_config = this.loadEnvironmentConfig(env);
        const database_config = this.loadDatabaseConfig();
        const bot_config = this.loadBotConfig();

        return {
            environment_config,
            database_config,
            bot_config,
        };
    }

    // Recursively searches the config directory for a specific file
    public static findConfigFile(fileName: string): string {
        const config_dir = path.join(__dirname, "config"); // config must be in the root folder
        const file_path = this.searchConfigDir(config_dir, fileName);

        if (!file_path) {
            throw new Error(`Configuration file ${fileName} not found in the config directory.`);
        }

        return file_path;
    }

    // Helper function to recursively search the directory for the file
    private static searchConfigDir(dir: string, fileName: string): string | null {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const full_path = path.join(dir, file);
            const stat = fs.statSync(full_path);

            // If it's a directory, recursively search it
            if (stat.isDirectory()) {
                const found = this.searchConfigDir(full_path, fileName);
                if (found) {
                    return found;
                }
            } else if (file === fileName) {
                // If it's the file we're looking for, return the path
                return full_path;
            }
        }

        // Return null if the file wasn't found
        return null;
    }
}

export { ConfigSystem };
