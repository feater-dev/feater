var _ = require('underscore');

module.exports = function (baseClasses, interpolationHelper, buildInstanceRepository) {

    var { BuildInstanceJob, JobExecutor } = baseClasses;

    class PrepareSummaryItemsJob extends BuildInstanceJob {}

    class PrepareSummaryItemsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PrepareSummaryItemsJob);
        }

        execute(job) {
            var { buildInstance } = job;

            return new Promise(resolve => {
                _.each(
                    buildInstance.config.summaryItems,
                    summaryItem => {
                        buildInstance.addSummaryItem(
                            summaryItem.name,
                            interpolationHelper.interpolateText(summaryItem.value, buildInstance.featVariables, buildInstance.externalPorts)
                        )
                    }
                );

                buildInstance.log(`Summary items set.`);

                buildInstanceRepository
                    .updateSummaryItems(buildInstance)
                    .then(resolve());
            });
        }
    }

    return {
        PrepareSummaryItemsJob,
        PrepareSummaryItemsJobExecutor
    };

};
