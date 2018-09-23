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
        readonly asset: string;
    };
    readonly googleOAuth2: {
        readonly clientId: string;
        readonly clientSecret: string;
        readonly allowedDomains: string[];
        readonly baseUrl: string;
    };
    readonly githubOAuth2: {
        readonly clientId: string;
        readonly clientSecret: string;
        readonly baseUrl: string;
    };
    readonly instantiation: {
        readonly composeHttpTimeout: number;
        readonly composeBinaryPath: string;
        readonly dockerBinaryPath: string;
        readonly containerNamePrefix: string;
        readonly proxyDomainsNetworkName: string;
    };
    readonly logger: {
        readonly elasticsearchHost: string;
        readonly elasticsearchLogLevel: string;
        readonly consoleLogLevel: string;
    };
}
