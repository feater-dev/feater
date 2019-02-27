import {ConfigInterface} from './config.interface';
import * as process from 'process';
import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.FEATER_ENV_FILE) {
    const dotenvResult = dotenv.config({path: process.env.FEATER_ENV_FILE});

    if (dotenvResult.error) {
        throw dotenvResult.error;
    }
}

export const config: ConfigInterface = {
    mongo: {
        dsn: process.env.FEATER_MONGO_DSN,
    },
    guestPaths: {
        root: path.join(__dirname, '../..'),
        asset: process.env.FEATER_GUEST_PATH_ASSET,
        build: process.env.FEATER_GUEST_PATH_BUILD,
        identity: process.env.FEATER_GUEST_PATH_IDENTITY,
        proxy: process.env.FEATER_GUEST_PATH_PROXY,
    },
    hostPaths: {
        build: process.env.FEATER_HOST_PATH_BUILD,
    },
    instantiation: {
        gitBinaryPath: process.env.FEATER_GIT_BINARY_PATH,
        dockerBinaryPath: process.env.FEATER_DOCKER_BINARY_PATH,
        dockerComposeHttpTimeout: Number(process.env.FEATER_DOCKER_COMPOSE_HTTP_TIMEOUT),
        containerNamePrefix: process.env.FEATER_CONTAINER_NAME_PREFIX,
        proxyDomainPattern: process.env.FEATER_PROXY_DOMAIN_PATTERN,
        proxyNetworkName: process.env.FEATER_PROXY_NETWORK_NAME,
        dockerComposeVersion: process.env.FEATER_DOCKER_COMPOSE_VERSION,
    },
    logger: {
        console: {
            logLevel: process.env.FEATER_LOG_LEVEL_CONSOLE,
        },
        mongoDb: {
            logLevel: process.env.FEATER_LOG_LEVEL_MONGO,
        },
    },
};

// TODO Validate config.
