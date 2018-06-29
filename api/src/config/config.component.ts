import {environment} from '../environment/environment';
import {Component} from '@nestjs/common';

interface AppConfigInterface {
    readonly versionNumber: string;
    readonly scheme: string;
    readonly host: string;
    readonly port: number;
    readonly proxyPort: number;
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

interface InstantiationConfigInterface {
    readonly composeHttpTimeout: number;
    readonly composeBinaryPath: string;
    readonly containerNamePrefix: string;
    readonly proxyDomainsNetworkName: string;
}

interface LoggerConfigInterface {
    readonly elasticsearchHost: string;
    readonly elasticsearchLogLevel: string;
    readonly consoleLogLevel: string;
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
    readonly instantiation: InstantiationConfigInterface;
    readonly logger: LoggerConfigInterface;

    constructor() {
        this.app = environment.app as AppConfigInterface;
        this.ports = environment.ports as PortsConfigInterface;
        this.mongo = environment.mongo as MongoConfigInterface;
        this.github = environment.github as GithubConfigInterface;
        this.guestPaths = environment.guestPaths as GuestPathsConfigInterface;
        this.hostPaths = environment.hostPaths as HostPathsConfigInterface;
        this.googleOAuth2 = environment.googleOAuth2 as GoogleOAuth2ConfigInterface;
        this.githubOAuth2 = environment.githubOAuth2 as GithubOAuth2ConfigInterface;
        this.instantiation = environment.instantiation as InstantiationConfigInterface;
        this.logger = environment.logger as LoggerConfigInterface;
    }

}
