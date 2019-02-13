import {ConfigInterface} from './config.interface';
import * as process from 'process';
import * as dotenv from 'dotenv';

if (process.env.FEATER_API_ENV_FILE) {
    const dotenvResult = dotenv.config({path: process.env.FEATER_API_ENV_FILE});

    if (dotenvResult.error) {
        throw dotenvResult.error;
    }
}

export const config: ConfigInterface = {
    mongo: {
        dsn: process.env.FEATER_API_MONGO_DSN,
    },
    guestPaths: {
        root: process.env.FEATER_API_GUEST_PATH_ROOT,
        build: process.env.FEATER_API_GUEST_PATH_BUILD,
        proxyDomain: process.env.FEATER_API_GUEST_PATH_PROXY_DOMAIN,
        asset: process.env.FEATER_API_GUEST_PATH_ASSET,
    },
    hostPaths: {
        build: process.env.FEATER_API_HOST_PATH_BUILD,
        asset: process.env.FEATER_API_HOST_PATH_ASSET,
    },
    instantiation: {
        dockerBinaryPath: process.env.FEATER_API_DOCKER_BINARY_PATH,
        dockerComposeBinaryPath: process.env.FEATER_API_DOCKER_COMPOSE_BINARY_PATH,
        dockerComposeHttpTimeout: Number(process.env.FEATER_API_DOCKER_COMPOSE_HTTP_TIMEOUT),
        containerNamePrefix: process.env.FEATER_API_CONTAINER_NAME_PREFIX,
        proxyDomainPattern: process.env.FEATER_API_PROXY_DOMAIN_PATTERN,
        proxyDomainNetworkName: process.env.FEATER_API_PROXY_DOMAIN_NETWORK_NAME,
    },
    logger: {
        console: {
            logLevel: process.env.FEATER_API_LOG_LEVEL_CONSOLE,
        },
        mongoDb: {
            logLevel: process.env.FEATER_API_LOG_LEVEL_MONGO,
        },
    },
};

// TODO Validate config.

// TODO Remove.
console.log('--- config');
console.log(config);
