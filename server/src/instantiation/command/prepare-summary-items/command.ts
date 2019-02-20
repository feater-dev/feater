import {SimpleCommand} from '../../executor/simple-command';
import {SummaryItemsSet} from '../../sets/summary-items-set';
import {FeaterVariablesSet} from '../../sets/feater-variables-set';

export class PrepareSummaryItemsCommand extends SimpleCommand {

    constructor(
        readonly featerVariables: FeaterVariablesSet,
        readonly summaryItems: SummaryItemsSet,
    ) {
        super();
    }

}
