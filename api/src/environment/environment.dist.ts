import {EnvironmentInterface} from './environment.interface';

export const environment: EnvironmentInterface = {
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
        asset: '/data/asset/',
    },
    hostPaths: {
        build: '/home/malef/Development/Feat/data/build/',
        composerCache: '/home/malef/Development/Feat/data/composer/',
        npmCache: '/home/malef/Development/Feat/data/npm/',
        asset: '/home/malef/Development/Feat/data/asset/',
    },
    instantiation: {
        composeHttpTimeout: 5000,
        composeBinaryPath: '/usr/local/bin/docker-compose',
        dockerBinaryPath: '/usr/bin/docker',
        containerNamePrefix: 'featinstance',
        proxyDomainsNetworkName: 'feat_featproxy', // Value of COMPOSE_PROJECT_NAME is prepended by default.
    },
    logger: {
        console: {
            logLevel: 'info',
        },
        mongoDb: {
            logLevel: 'info',
        },
    },
};
