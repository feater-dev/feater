let { execSync, exec } = require('child_process');

const BUFFER_SIZE = 1048576; // 1M

module.exports = () => {

    function inspectBuild(build) {
        let inspectContainersStdout = execSync(
            `docker inspect ${build.containerIds.join(' ')}`,
            { maxBuffer: BUFFER_SIZE }
        );

        let containerDetails = {};
        for (let inspectContainer of JSON.parse(inspectContainersStdout)) {
            containerDetails[inspectContainer.Id] = {
                id: inspectContainer.Id,
                createdAt: inspectContainer.CreatedAt,
                state: {
                    status: inspectContainer.Status,
                    startedAt: inspectContainer.StartedAt,
                    finishedAt: inspectContainer.FinishedAt
                }
            };
        }

        return containerDetails;
    }

    function executeCommand(command)
    {
        return new Promise((resolve, reject) => {
            exec(
                command,
                { maxBuffer: BUFFER_SIZE },
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(stderr);
                        reject(error);

                        return;
                    }

                    resolve(stdout);
                }
            );
        });
    }

    function startBuild(build) {
        return executeCommand(`docker start ${build.containerIds.join(' ')}`);
    }

    function stopBuild(build) {
        return executeCommand(`docker stop ${build.containerIds.join(' ')}`);
    }

    function pauseBuild(build) {
        return executeCommand(`docker pause ${build.containerIds.join(' ')}`);
    }

    function unpauseBuild(build) {
        return executeCommand(`docker unpause ${build.containerIds.join(' ')}`);
    }

    return {
        inspectBuild,
        startBuild,
        stopBuild,
        pauseBuild,
        unpauseBuild
    };

};
