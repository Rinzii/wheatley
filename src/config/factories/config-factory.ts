// src/config/config-factory.ts

import { IConfig } from "../schemas/interfaces.js";

// ConfigFactory class manages config types and loaders
class ConfigFactory {
    private static configLoaders: { [key: string]: (filePath: string) => IConfig } = {};

    // Register the loader for the specified config type
    static registerConfigType(type: string, loader: (filePath: string) => IConfig) {
        this.configLoaders[type] = loader;
    }

    // Load the configuration using the specified loader
    static loadConfig<T extends IConfig>(type: string, filePath: string): T {
        const loader = this.configLoaders[type];

        // Return the loaded config
        return loader(filePath) as T;
    }
}

export { ConfigFactory };
