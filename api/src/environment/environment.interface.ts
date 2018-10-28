export interface EnvironmentInterface {
    readonly app: {
        readonly versionNumber: string;
        readonly scheme: string;
        readonly host: string;
    };
    readonly mongo: {
        readonly dsn: string;
    };
    readonly redis: {
        readonly url: string;
    };
    readonly sshKey: {
        readonly publicKeyPath: string;
        readonly privateKeyPath: string;
        readonly passphrase: string;
    };
    readonly guestPaths: {
        readonly build: string;
        readonly proxyDomain: string;
        readonly asset: string;
    };
    readonly hostPaths: {
        readonly build: string;
        readonly composerCache: string;
        readonly npmCache: string;
        readonly yarnCache: string;
        readonly asset: string;
    };
    readonly instantiation: {
        readonly composeHttpTimeout: number;
        readonly composeBinaryPath: string;
        readonly dockerBinaryPath: string;
        readonly containerNamePrefix: string; // TODO Rename to composeProjectNamePrefix.
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
