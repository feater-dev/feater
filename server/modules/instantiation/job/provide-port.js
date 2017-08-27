var _ = require('underscore');
var Promise = require('bluebird');

module.exports = function (baseClasses, portProvider, buildInstanceRepository) {

    var { BuildInstanceJob, JobExecutor } = baseClasses;

    class ProvidePortJob extends BuildInstanceJob {
        constructor(buildInstance, portName, portRanges) {
            super(buildInstance);
            this.portName = portName;
            this.portRanges = portRanges;
        }
    }

    class ProvidePortJobExecutor extends JobExecutor {
        supports (job) {
            return (job instanceof ProvidePortJob);
        }

        execute(job) {
            var { buildInstance } = job;

            return new Promise((resolve) => {
                var port = portProvider.providePort(
                    _.map(job.portRanges, (portRange) => ({ minPort: portRange[0], maxPort: portRange[1] }))
                );
                buildInstance.addExternalPort(job.portName, port);

                buildInstance.log(`Assigned port ${port} for ${job.portName} external port.`);

                buildInstanceRepository
                    .updateExternalPorts(buildInstance)
                    .then(resolve);
            });
        }
    }

    return {
        ProvidePortJob,
        ProvidePortJobExecutor
    };

};
