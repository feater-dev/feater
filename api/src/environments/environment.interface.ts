export interface EnvironmentInterface {
    readonly app: {
        readonly versionNumber: string;
    };
    readonly mongo: {
        readonly dsn: string;
    };
    readonly redis: {
        readonly url: string;
    };
    readonly guestPaths: {
        readonly build: string;
        readonly proxyDomain: string;
        readonly asset: string;
    };
    readonly hostPaths: {
        readonly build: string;
        readonly asset: string;
    };
    readonly instantiation: {
        readonly composeBinaryPath: string;
        readonly composeHttpTimeout: number;
        readonly dockerBinaryPath: string;
        readonly containerNamePrefix: string; // TODO Rename to composeProjectNamePrefix.
        readonly proxyDomainPattern: string;
        readonly proxyDomainsNetworkName: string;
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
