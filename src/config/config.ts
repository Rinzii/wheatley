// src/config/config.ts

import { ConfigSystem } from "./schemas/config-system.js"; // Import the ConfigSystem class

// Define the environment you are working with (e.g., 'development' or 'production')
const environment = process.env.NODE_ENV || "development"; // Default to 'development' if not set

// Load all necessary configurations
const { environment_config, database_config, bot_config } = ConfigSystem.loadAllConfigs(environment);

// Export all the configurations for use in other parts of the application
export { environment_config, database_config, bot_config };

// Example usage of specific configurations

// Log some information for debugging
console.log("Environment Configuration:", environment_config);
console.log("Database Configuration:", database_config);
console.log("Bot Configuration:", bot_config);
