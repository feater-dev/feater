export const environment = {
    app: {
        versionNumber: '0.0',
        scheme: 'https',
        host: 'feat.org',
    },
    mongo: {
        dsn: 'mongodb://user:password@host:27017/feat',
    },
    redis: {
        url: 'redis://user:password@host:6379/1',
    },
    sshKey: {
        publicKeyPath: '/root/.ssh/id_rsa.pub',
        privateKeyPath: '/root/.ssh/id_rsa',
        passphrase: 'passphrase',
    },
    guestPaths: {
        build: '/data/build/',
        proxyDomain: '/data/proxyDomain/',
    },
    hostPaths: {
        build: '/home/malef/Development/Feat/data/build/',
        composerCache: '/home/malef/Development/Feat/data/composer/',
        npmCache: '/home/malef/Development/Feat/data/npm/',
    },
    googleOAuth2: {
        clientId: 'googleOAuth2ClientId',
        clientSecret: 'googleOAuth2ClientSecret',
        allowedDomains: [
            'googleOAuth2AllowedDomain1',
            'googleOAuth2AllowedDomain2',
        ],
    },
    instantiation: {
        composeHttpTimeout: 5000,
        composeBinaryPath: '/usr/local/bin/docker-compose',
        containerNamePrefix: 'featinstance',
        proxyDomainsNetworkName: 'feat_featproxy', // Value of COMPOSE_PROJECT_NAME is prepended by default.
    },
    logger: {
        elasticsearchHost: 'elasticsearch:9200',
        elasticsearchLogLevel: 'warning',
        consoleLogLevel: 'debug',
    },
};
