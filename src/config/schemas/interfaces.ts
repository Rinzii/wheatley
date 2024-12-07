// src/interfaces.ts

export interface IConfig {
    name: string;
}

export interface IServerConfig extends IConfig {
    serverId: string;
    serverName: string;
}

export interface IDatabaseConfig extends IConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface IBotConfig extends IConfig {
    token: string;
    owner: string;
}
