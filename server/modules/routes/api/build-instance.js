let nanoidGenerate = require('nanoid/generate');

module.exports = function (stepsMapBuilder, stepsMapRunner, buildInstanceRepository, buildDefinitionRepository, projectRepository, sourceCodeFetcher, validator) {

    return [
        {
            method: 'get',
            path: '/api/build-instance',
            middlewares: [
                (req, res) => {
                    buildInstanceRepository
                        .list({})
                        .then(buildInstances => buildInstances.toArray())
                        .then(buildInstances => {
                            res.json({ data: buildInstances });
                        });
                }
            ]
        },
        {
            method: 'get',
            path: '/api/build-instance/:buildInstanceId',
            middlewares: [
                (req, res) => {
                    var stepsMap = {};

                    stepsMapBuilder.addFindBuildInstanceByIdStep(stepsMap, req.params.buildInstanceId);
                    stepsMapBuilder.addFindBuildDefinitionByBuildInstanceStep(stepsMap);
                    stepsMapBuilder.addFindProjectByBuildDefinitionStep(stepsMap);

                    stepsMapRunner
                        .run(stepsMap)
                        .then(resolutions => {
                            let data = JSON.parse(
                                JSON.stringify(resolutions.buildInstance)
                            );
                            delete data.buildDefinitionId;
                            data.buildDefinition = {
                                _id: resolutions.buildDefinition._id,
                                name: resolutions.buildDefinition.name,
                                project: {
                                    _id: resolutions.project._id,
                                    name: resolutions.project.name
                                }
                            };

                            res.json({ data });
                        })
                        .catch(errors => {
                            console.log('ERRORS', errors);
                            res.status(400).send();
                        });
                }
            ]
        },
        {
            method: 'post',
            path: '/api/build-instance',
            middlewares: [
                (req, res) => {
                    var scope = {};

                    function validateRequest() {
                        return validator.validate(req.body, 'api.buildInstance.addBuildInstance');
                    }

                    function findBuildDefinition() {
                        return buildDefinitionRepository
                            .getOrFail(req.body.buildDefinitionId)
                            .then(buildDefinition => {
                                scope.buildDefinition = buildDefinition;
                            });
                    }

                    function persistDocument() {
                        var buildInstanceDocument = {
                            buildDefinitionId: req.body.buildDefinitionId,
                            name: req.body.name
                        };

                        return buildInstanceRepository
                            .add(buildInstanceDocument)
                            .then(buildInstanceId => {
                                scope.buildInstanceId = buildInstanceId.toString();
                            });
                    }

                    function respondWithId() {
                        res.status(201).json({ data: { id: scope.buildInstanceId } });
                    }

                    function executeBuildInstanceJobs() {
                        process.nextTick(() => {
                            var buildInstance = sourceCodeFetcher.createBuildInstance(
                                scope.buildInstanceId,
                                nanoidGenerate('0123456789abcdefghijklmnopqrstuvwxyz', 8),
                                scope.buildDefinition
                            );
                            sourceCodeFetcher.executeJobsForBuildInstance(buildInstance);
                        });
                    }

                    function respondWithErrors(errors) {
                        console.log('ERRORS', errors);
                        res.status(400).send();
                    }

                    validateRequest()
                        .then(findBuildDefinition)
                        .then(persistDocument)
                        .then(respondWithId)
                        .then(executeBuildInstanceJobs)
                        .catch(respondWithErrors);
                }
            ]
        }
    ];

};
