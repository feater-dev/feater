import * as camelCase from 'camelcase';
import { Injectable } from '@angular/core';

@Injectable()
export class CamelCaseConverter {
    convert(inputObject: object): object {
        if (
            'string' === typeof inputObject ||
            'number' === typeof inputObject ||
            'boolean' === typeof inputObject ||
            null === inputObject
        ) {
            return inputObject;
        }

        if (Array.isArray(inputObject)) {
            return inputObject.map(value => this.convert(value));
        }

        const outputObject = {};
        for (const key in inputObject) {
            outputObject[camelCase(key)] = this.convert(inputObject[key]);
        }

        return outputObject;
    }
}
