import {EnvironmentInterface} from './environment.interface';

export const environment: EnvironmentInterface = {
    app: {
        versionNumber: '0.1.0',
    },
    mongo: {
        dsn: 'mongodb://user:password@host:27017/feater',
    },
    redis: {
        url: 'redis://user:password@host:6379/1',
    },
    guestPaths: {
        root: '/app/',
        build: '/data/build/',
        proxyDomain: '/data/proxyDomain/',
        asset: '/data/asset/',
    },
    hostPaths: {
        build: '/home/me/feater-data/build/',
        asset: '/home/me/feater-data/asset/',
    },
    instantiation: {
        composeBinaryPath: '/usr/local/bin/docker-compose',
        composeHttpTimeout: 5000,
        dockerBinaryPath: '/usr/bin/docker',
        composeProjectNamePattern: 'featerinstance{{{instance_hash}}}',
        proxyDomainPattern: `{{{instance_hash}}}-{{{port_id}}}.my-feater-host`,
        proxyDomainsNetworkName: 'feater_proxy', // Value of COMPOSE_PROJECT_NAME is prepended by default.
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
