export interface ConfigInterface {
    readonly mongo: {
        readonly dsn: string;
    };
    readonly guestPaths: {
        readonly root: string;
        readonly build: string;
        readonly proxy: string;
        readonly asset: string;
    };
    readonly hostPaths: {
        readonly build: string;
        readonly asset: string;
    };
    readonly instantiation: {
        readonly dockerBinaryPath: string;
        readonly dockerComposeHttpTimeout: number;
        readonly containerNamePrefix: string;
        readonly proxyDomainPattern: string;
        readonly proxyNetworkName: string;
    };
    readonly logger: {
        readonly console: {
            readonly logLevel: string;
        };
        readonly mongoDb: {
            readonly logLevel: string;
        }
    };
}
