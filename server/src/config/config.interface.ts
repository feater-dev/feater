export interface ConfigInterface {
    readonly mongo: {
        readonly dsn: string;
    };
    readonly guestPaths: {
        readonly root: string;
        readonly asset: string;
        readonly build: string;
        readonly identity: string;
        readonly proxy: string;
    };
    readonly hostPaths: {
        readonly build: string;
    };
    readonly instantiation: {
        readonly gitBinaryPath: string;
        readonly dockerBinaryPath: string;
        readonly dockerComposeHttpTimeout: number;
        readonly containerNamePrefix: string;
        readonly proxyDomainPattern: string;
        readonly proxyNetworkName: string;
        readonly dockerComposeVersion: string;
    };
    readonly logger: {
        readonly console: {
            readonly logLevel: string;
        };
        readonly mongoDb: {
            readonly logLevel: string;
        };
    };
}
