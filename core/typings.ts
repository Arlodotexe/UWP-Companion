/* Typings for core js files */

export interface IClient {
    parseUrl: Function;
    config: IClientConfig;
    name: string;
}

export interface IClientConfig {
    color: string;
}

export interface IPlatform {
    name: string,
    baseUrlMatch: Function,
    shouldCloseOnSwitch: Function,
    clients: {
        [key: string]: IClient;
    }
    // Additional general helper methods for the platform
    [key: string]: any;
}

export interface IPlatforms {
    [key: string]: IPlatform
}
export interface ILib {
    platforms: IPlatforms;
}

export interface ISettings {
    [key: string]: {
        prefferedApp: string,
        isEnabled: boolean,
        closeOnSwitch: boolean        
    }
}