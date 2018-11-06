import {EnvironmentInterface} from './environment.interface';

export const environment: EnvironmentInterface = {
    app: {
        versionNumber: '0.0.1',
    },
    mongo: {
        dsn: 'mongodb://mongo:27017/feater',
    },
    redis: {
        url: 'redis://redis:6379/1',
    },
    guestPaths: {
        build: '/data/build/',
        proxyDomain: '/data/proxyDomain/',
        asset: '/data/asset/',
    },
    hostPaths: {
        build: '/home/malef/Development/Feater/data/build/',
        asset: '/home/malef/Development/Feater/data/asset/',
    },
    instantiation: {
        composeBinaryPath: '/usr/local/bin/docker-compose',
        composeHttpTimeout: 5000,
        dockerBinaryPath: '/usr/bin/docker',
        containerNamePrefix: 'featerinstance',
        proxyDomainPattern: `{instance_hash}-{port_id}.feater.localhost`,
        proxyDomainsNetworkName: 'feater_featerproxy', // Value of COMPOSE_PROJECT_NAME is prepended by default.
    },
    logger: {
        console: {
            logLevel: 'debug',
        },
        mongoDb: {
            logLevel: 'debug',
        },
    },
};
