import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as escapeStringRegexp from 'escape-string-regexp';
import {parse} from 'esprima';
import * as evaluate from 'static-eval';
import {Component} from '@nestjs/common';
import {Config} from '../config/config.component';

@Component()
export class InterpolationHelper {

    private readonly tokenDelimiters = ['{{{', '}}}'];
    private readonly expressionDelimiters = ['{{@', '@}}'];

    constructor(
        private readonly config: Config,
    ) {}

    interpolateText(text: string, build: any): string {
        text = this.interpolateExpressions(text, build);
        text = this.interpolateTokens(text, build);

        return text;
    }

    interpolateFile(fullPath: string, build: any): void {
        let text = fs.readFileSync(fullPath).toString();

        text = this.interpolateText(text, build);

        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, text);
    }

    private interpolateExpressions(text: string, build: any): string {
        const allProxiedPorts = {};

        for (const serviceId of Object.keys(build.services)) {
            for (const proxiedPort of build.services[serviceId].proxiedPorts) {
                allProxiedPorts[proxiedPort.id] = proxiedPort;
            }
        }

        const interpolatedFunctions = {
            proxy_url: id => {
                return `http://${this.getProxiedPort(allProxiedPorts, id).proxyDomains.short}`;
            },
            proxy_domain: id => {
                return this.getProxiedPort(allProxiedPorts, id).proxyDomains.short;
            },
        };

        const expressionRegExp = new RegExp(
            `${escapeStringRegexp(this.expressionDelimiters[0])}(.+?)${escapeStringRegexp(this.expressionDelimiters[1])}`,
            'g',
        );

        return text.replace(
            expressionRegExp,
            match => {
                return evaluate(
                    parse(match.substr(3, match.length - 6)).body[0].expression,
                    interpolatedFunctions,
                );
            },
        );
    }

    private interpolateTokens(text: string, build: any): string {
        return _.reduce(
            _.keys(build.featVariables),
            (reducedText, tokenName) => {
                const tokenRegExp = new RegExp(
                    escapeStringRegexp(`${this.tokenDelimiters[0]}${tokenName}${this.tokenDelimiters[1]}`),
                    'g',
                );

                return reducedText.replace(
                    tokenRegExp,
                    build.featVariables[tokenName],
                );
            },
            text,
        );
    }

    private getProxiedPort(allProxiedPorts: any, id: string): any {
        const proxiedPort = allProxiedPorts[id];

        if (!proxiedPort) {
            throw new Error(`Proxied port ${id} not found.`);
        }

        return proxiedPort;
    }

}
