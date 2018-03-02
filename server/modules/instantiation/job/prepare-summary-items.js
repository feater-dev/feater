var _ = require('underscore');

module.exports = function (jobClasses, interpolationHelper, buildRepository) {

    var { BuildJob, JobExecutor } = jobClasses;

    class PrepareSummaryItemsJob extends BuildJob {}

    class PrepareSummaryItemsJobExecutor extends JobExecutor {
        supports(job) {
            return (job instanceof PrepareSummaryItemsJob);
        }

        execute(job) {
            var { build } = job;

            build.log(`Setting summary items.`);

            return new Promise(resolve => {
                _.each(
                    build.config.summaryItems,
                    summaryItem => {
                        build.addSummaryItem(
                            summaryItem.name,
                            interpolationHelper.interpolateText(summaryItem.value, build.featVariables, build.exposedPorts)
                        )
                    }
                );

                buildRepository
                    .updateSummaryItems(build)
                    .then(resolve());
            });
        }
    }

    return {
        PrepareSummaryItemsJob,
        PrepareSummaryItemsJobExecutor
    };

};
