import {EnvironmentInterface} from './environment.interface';

export const environment: EnvironmentInterface = {
    app: {
        versionNumber: '0.0.1',
    },
    mongo: {
        dsn: 'mongodb://user:password@host:27017/feater',
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
        build: '/home/me/feater/data/build/',
        composerCache: '/home/me/feater/data/composer/',
        npmCache: '/home/me/feater/data/npm/',
        yarnCache: '/home/me/feater/data/yarn/',
        asset: '/home/me/feater/data/asset/',
    },
    instantiation: {
        composeHttpTimeout: 5000,
        composeBinaryPath: '/usr/local/bin/docker-compose',
        dockerBinaryPath: '/usr/bin/docker',
        containerNamePrefix: 'featerinstance',
        proxyDomainPattern: `{instance_hash}-{port_id}.feater.org`,
        proxyDomainsNetworkName: 'feater_featerproxy', // Value of COMPOSE_PROJECT_NAME is prepended by default.
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
