import * as iniConfig from 'ini-config';
import * as path from 'path';
import { ApplicationConfig } from '@nestjs/core/application-config';
import { Component } from '@nestjs/common';

const configFullPath = path.join(__dirname, '..', '..');

class AppConfigInterface {
    readonly versionNumber: string;
    readonly scheme: string;
    readonly host: string;
    readonly port: number;
    readonly proxyPort: number;
    readonly baseUrl: string;
    readonly hostAndPort: string;
}

interface PortsConfigInterface {
    readonly translation: number;
}

interface MongoConfigInterface {
    readonly dsn: string;
}

interface GithubConfigInterface {
    readonly personalAccessToken: string;
}

interface GuestPathsConfigInterface {
    readonly repositoryCache: string;
    readonly build: string;
    readonly proxyDomain: string;
}

interface HostPathsConfigInterface {
    readonly build: string;
    readonly composerCache: string;
    readonly npmCache: string;
}

interface GoogleOAuth2ConfigInterface {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly allowedDomains: string[];
    readonly baseUrl: string;
}

interface GithubOAuth2ConfigInterface {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly baseUrl: string;
}

@Component()
export class Config {

    readonly app: AppConfigInterface;
    readonly ports: PortsConfigInterface;
    readonly mongo: MongoConfigInterface;
    readonly github: GithubConfigInterface;
    readonly guestPaths: GuestPathsConfigInterface;
    readonly hostPaths: HostPathsConfigInterface;
    readonly googleOAuth2: GoogleOAuth2ConfigInterface;
    readonly githubOAuth2: GithubOAuth2ConfigInterface;

    constructor() {
        const rawConfig = iniConfig(configFullPath);

        // TODO Pass environment through some envvar.
        rawConfig.apply('dev');

        const rawAppConfig = {
            versionNumber: rawConfig.app.versionNumber,
            scheme: rawConfig.app.scheme,
            host: rawConfig.app.host,
            port: parseInt(rawConfig.app.port, 10),
            proxyPort: parseInt(rawConfig.app.proxyPort, 10),
            baseUrl: null,
            hostAndPort: null,
        };

        rawAppConfig.baseUrl = `${rawAppConfig.scheme}://${rawAppConfig.host}:${rawAppConfig.port}`;

        rawAppConfig.hostAndPort = rawAppConfig.host;
        if (
            'http' === rawAppConfig.scheme && 80 !== rawAppConfig.port
            || 'https' === rawAppConfig.scheme && 443 !== rawAppConfig.port
        ) {
            rawAppConfig.hostAndPort += `:${rawAppConfig.port}`;
        }

        this.app = rawAppConfig as AppConfigInterface;

        this.ports = {
            translation: parseInt(rawConfig.ports.translation, 10),
        } as PortsConfigInterface;

        this.mongo = {
            dsn: rawConfig.mongo.dsn,
        } as MongoConfigInterface;

        this.github = {
            personalAccessToken: rawConfig.github.personalAccessToken,
        } as GithubConfigInterface;

        this.guestPaths = {
            repositoryCache: rawConfig.guestPaths.repositoryCache,
            build: rawConfig.guestPaths.build,
            proxyDomain: rawConfig.guestPaths.proxyDomain,
        } as GuestPathsConfigInterface;

        this.hostPaths = {
            build: rawConfig.hostPaths.build,
            composerCache: rawConfig.hostPaths.composerCache,
            npmCache: rawConfig.hostPaths.npmCache,
        } as HostPathsConfigInterface;

        this.googleOAuth2 = {
            clientId: rawConfig.googleOAuth2.clientId,
            clientSecret: rawConfig.googleOAuth2.clientSecret,
            allowedDomains: rawConfig.googleOAuth2.allowedDomains,
            baseUrl: rawConfig.googleOAuth2.baseUrl,
        } as GoogleOAuth2ConfigInterface;

        this.githubOAuth2 = {
            clientId: rawConfig.githubOAuth2.clientId,
            clientSecret: rawConfig.githubOAuth2.clientSecret,
            baseUrl: rawConfig.githubOAuth2.baseUrl,
        } as GithubOAuth2ConfigInterface;
    }

}
