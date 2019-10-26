import { Pipe, PipeTransform } from '@angular/core';
import * as jsYaml from 'js-yaml';

const options = {
    indent: 4,
};

@Pipe({ name: 'yaml' })
export class YamlPipe implements PipeTransform {
    transform(text: string): string {
        return text ? jsYaml.safeDump(text, options) : text;
    }
}
