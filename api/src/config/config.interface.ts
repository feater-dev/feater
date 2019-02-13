export interface ConfigInterface {
    readonly mongo: {
        readonly dsn: string;
    };
    readonly guestPaths: {
        readonly root: string;
        readonly build: string;
        readonly proxyDomain: string;
        readonly asset: string;
    };
    readonly hostPaths: {
        readonly build: string;
        readonly asset: string;
    };
    readonly instantiation: {
        readonly dockerBinaryPath: string;
        readonly dockerComposeBinaryPath: string;
        readonly dockerComposeHttpTimeout: number;
        readonly containerNamePrefix: string;
        readonly proxyDomainPattern: string;
        readonly proxyDomainNetworkName: string;
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
