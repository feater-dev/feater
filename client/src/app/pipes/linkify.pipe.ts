import { Pipe, PipeTransform } from '@angular/core';
import htmlLinkify from 'html-linkify';

const options = {
    attributes: {
        target: '_blank',
    },
};

@Pipe({ name: 'linkify' })
export class LinkifyPipe implements PipeTransform {
    transform(text: string): string {
        return text ? htmlLinkify(text, options) : text;
    }
}
