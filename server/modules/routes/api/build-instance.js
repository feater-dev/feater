module.exports = function (buildInstanceRepository, buildDefinitionRepository, projectRepository, sourceCodeFetcher, validator) {

    return [
        {
            method: 'get',
            path: '/api/build-instance',
            middlewares: [
                function (req, res) {
                    buildInstanceRepository
                        .list({})
                        .then(function (buildInstances) {
                            buildInstances
                                .toArray()
                                .then(function (buildInstances) {
                                    res.json({data: buildInstances});
                                });
                        });
                }
            ]
        },
        {
            method: 'get',
            path: '/api/build-instance/:buildInstanceId',
            middlewares: [
                function (req, res) {
                    var scope = {};

                    function findDocument() {
                        return buildInstanceRepository
                            .get(req.params.buildInstanceId)
                            .then(function (document) {
                                if (null === document) {
                                    res.status(404).send();

                                    return;
                                }

                                scope.document = document;
                            });
                    }

                    function findBuildDefinition() {
                        return buildDefinitionRepository
                            .get(scope.document.buildDefinitionId)
                            .then(function (buildDefinition) {
                                if (null === buildDefinition) {
                                    res.status(404).send();

                                    return;
                                }

                                scope.buildDefinition = buildDefinition;
                            });
                    }

                    function findProject() {
                        return projectRepository
                            .get(scope.buildDefinition.projectId)
                            .then(function (project) {
                                if (null === project) {
                                    res.status(404).send();

                                    return;
                                }

                                scope.project = project;
                            });
                    }

                    function respondWithData() {
                        var data = JSON.parse(JSON.stringify(scope.document));
                        delete data.buildDefinitionId;
                        data.buildDefinition = {
                            _id: scope.buildDefinition._id,
                            name: scope.buildDefinition.name,
                            project: {
                                _id: scope.project._id,
                                name: scope.project.name
                            }
                        };

                        res.json({data});
                    }

                    function respondWithErrors(errors) {
                        console.log('ERRORS', errors);
                        res.status(400).send();
                    }

                    findDocument()
                        .then(findBuildDefinition)
                        .then(findProject)
                        .then(respondWithData)
                        .catch(respondWithErrors);
                }
            ]
        },
        {
            method: 'post',
            path: '/api/build-instance',
            middlewares: [
                function (req, res) {
                    var scope = {};

                    function validateRequest() {
                        return validator.validate(req.body, 'api.buildInstance.addBuildInstance');
                    }

                    function findBuildDefinition() {
                        return buildDefinitionRepository
                            .getOrFail(req.body.buildDefinitionId)
                            .then(function (buildDefinition) {
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
                            .then(function (buildInstanceId) {
                                scope.buildInstanceId = buildInstanceId.toString();
                            });
                    }

                    function respondWithId() {
                        res.status(201).json({data: {id: scope.buildInstanceId}});
                    }

                    function executeBuildInstanceJobs() {
                        process.nextTick(() => {
                            var buildInstance = sourceCodeFetcher.createBuildInstance(scope.buildInstanceId, scope.buildDefinition);
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
