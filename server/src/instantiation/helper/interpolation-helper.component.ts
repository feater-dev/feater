import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as escapeStringRegexp from 'escape-string-regexp';
import { Injectable } from '@nestjs/common';
import { FeaterVariablesSet } from '../sets/feater-variables-set';

@Injectable()
export class InterpolationHelper {
    private readonly START_DELIMITER = '{{{';
    private readonly END_DELIMITER = '}}}';

    interpolateText(text: string, featerVariables: FeaterVariablesSet): string {
        return this.interpolateFeaterVariables(text, featerVariables);
    }

    interpolateFile(
        fullPath: string,
        featerVariables: FeaterVariablesSet,
    ): string {
        let text = fs.readFileSync(fullPath).toString();

        text = this.interpolateText(text, featerVariables);

        fs.truncateSync(fullPath);
        fs.writeFileSync(fullPath, text);

        return text;
    }

    private interpolateFeaterVariables(
        text: string,
        featerVariables: FeaterVariablesSet,
    ): string {
        return _.reduce(
            featerVariables.toList(),
            (reducedText, { name, value }) => {
                const tokenRegExp = new RegExp(
                    escapeStringRegexp(
                        `${this.START_DELIMITER}${name}${this.END_DELIMITER}`,
                    ),
                    'g',
                );

                return reducedText.replace(tokenRegExp, value);
            },
            text,
        );
    }
}
