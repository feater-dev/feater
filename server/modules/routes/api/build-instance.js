module.exports = (
    buildInstanceRepository,
    buildDefinitionRepository,
    projectRepository,
    sourceCodeFetcher,
    validator
) => [
    {
        method: 'get',
        path: '/api/build-instance',
        middlewares: [
            (req, res) => {
                buildInstanceRepository
                    .list({})
                    .then(buildInstances => {
                        buildInstances
                            .toArray()
                            .then(buildInstances => {
                                res.json({ data: buildInstances });
                            });
                    });
            }
        ]
    },
    {
        method: 'get',
        path: '/api/build-instance/:buildInstanceId',
        middlewares: [
            ({ params }, res) => {
                const scope = {};

                function findDocument() {
                    return buildInstanceRepository
                        .get(params.buildInstanceId)
                        .then(document => {
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
                        .then(buildDefinition => {
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
                        .then(project => {
                            if (null === project) {
                                res.status(404).send();

                                return;
                            }

                            scope.project = project;
                        });
                }

                function respondWithData() {
                    const data = JSON.parse(JSON.stringify(scope.document));
                    delete data.buildDefinitionId;
                    data.buildDefinition = {
                        _id: scope.buildDefinition._id,
                        name: scope.buildDefinition.name,
                        project: {
                            _id: scope.project._id,
                            name: scope.project.name
                        }
                    };

                    res.json({ data });
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
            ({ body }, res) => {
                const scope = {};

                function validateRequest() {
                    return validator.validate(body, 'api.buildInstance.addBuildInstance');
                }

                function findBuildDefinition() {
                    return buildDefinitionRepository
                        .getOrFail(body.buildDefinitionId)
                        .then(buildDefinition => {
                            scope.buildDefinition = buildDefinition;
                        });
                }

                function persistDocument() {
                    const buildInstanceDocument = {
                        buildDefinitionId: body.buildDefinitionId,
                        name: body.name
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
                        const buildInstance = sourceCodeFetcher.createBuildInstance(scope.buildInstanceId, scope.buildDefinition);
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
