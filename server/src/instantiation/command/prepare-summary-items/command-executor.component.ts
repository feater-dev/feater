import { Injectable } from '@nestjs/common';
import { InterpolationHelper } from '../../helper/interpolation-helper.component';
import { SimpleCommandExecutorComponentInterface } from '../../executor/simple-command-executor-component.interface';
import { SimpleCommand } from '../../executor/simple-command';
import { SummaryItemsSet } from '../../sets/summary-items-set';
import { PrepareSummaryItemsCommand } from './command';
import { PrepareSummaryItemsCommandResultInterface } from './command-result.interface';

@Injectable()
export class PrepareSummaryItemsCommandExecutorComponent
    implements SimpleCommandExecutorComponentInterface {
    constructor(private readonly interpolationHelper: InterpolationHelper) {}

    supports(command: SimpleCommand): boolean {
        return command instanceof PrepareSummaryItemsCommand;
    }

    async execute(command: SimpleCommand): Promise<any> {
        const {
            featerVariables,
            summaryItems,
            commandLogger,
        } = command as PrepareSummaryItemsCommand;

        const interpolatedSummaryItems = new SummaryItemsSet();
        commandLogger.info(
            `Available Feater variables:${
                featerVariables.isEmpty()
                    ? ' none'
                    : '\n' + JSON.stringify(featerVariables.toMap(), null, 2)
            }`,
        );
        for (const summaryItem of summaryItems.toList()) {
            interpolatedSummaryItems.add(
                summaryItem.name,
                this.interpolationHelper.interpolateText(
                    summaryItem.value,
                    featerVariables,
                ),
            );
        }

        return {
            summaryItems: interpolatedSummaryItems,
        } as PrepareSummaryItemsCommandResultInterface;
    }
}
