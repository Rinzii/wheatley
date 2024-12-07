import { IServerConfig } from "../schemas/interfaces.js";
import { ConfigSystem } from "../schemas/config-system.js"; // Import ConfigSystem for loading configs

export class ServerConfigManager {
    private config: IServerConfig;
    private environment: string;

    constructor(config_file_name: string, environment: string) {
        // Set the environment, for example "production" or "debug"
        this.environment = environment;

        // Initialize the config to an empty structure, adding the 'name' field
        this.config = { name: "", serverId: "", serverName: "" };

        // Load the configuration using ConfigSystem
        const config_file_path = ConfigSystem.findConfigFile(config_file_name); // Renamed variable to snake_case
        if (!config_file_path) {
            throw new Error(`Could not find configuration file: ${config_file_name}`);
        }

        // Load the config from the file
        this.load(config_file_path).catch(err => {
            throw new Error(`Failed to load config from ${config_file_path}: ${err.message}`);
        });
    }

    // Load the configuration
    private async load(filePath: string): Promise<void> {
        const config_data = ConfigSystem.loadConfig<IServerConfig>("json", filePath);

        this.config = { ...config_data };
    }

    getServerId(): string {
        // Decide based on the environment whether to use the production serverId or debug serverId
        if (this.environment === "production") {
            return this.config.serverId;
        } else {
            return this.config.serverId;
        }
    }

    // Getter for the server name based on the environment
    getServerName(): string {
        return this.config.serverName; // Server name from the config
    }
}
