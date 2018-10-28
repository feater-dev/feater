import {Injectable} from '@nestjs/common';
import {InterpolationHelper} from '../../helper/interpolation-helper.component';
import {SimpleCommandExecutorComponentInterface} from '../simple-command-executor-component.interface';
import {SimpleCommand} from '../../executor/simple-command';
import {SummaryItemsSet} from '../../sets/summary-items-set';
import {PrepareSummaryItemsCommand} from './command';
import {PrepareSummaryItemsCommandResultInterface} from './command-result.interface';

@Injectable()
export class PrepareSummaryItemsCommandExecutorComponent implements SimpleCommandExecutorComponentInterface {

    constructor(
        private readonly interpolationHelper: InterpolationHelper,
    ) {}

    supports(command: SimpleCommand): boolean {
        return (command instanceof PrepareSummaryItemsCommand);
    }

    execute(command: SimpleCommand): Promise<any> {
        const typedCommand = command as PrepareSummaryItemsCommand;

        return new Promise(resolve => {
            const interpolatedSummaryItems = new SummaryItemsSet();
            for (const summaryItem of typedCommand.summaryItems.toList()) {
                interpolatedSummaryItems.add(
                    summaryItem.name,
                    this.interpolationHelper.interpolateText(summaryItem.value, typedCommand.featerVariables),
                );
            }

            resolve({
                summaryItems: interpolatedSummaryItems,
            } as PrepareSummaryItemsCommandResultInterface);
        });
    }
}
