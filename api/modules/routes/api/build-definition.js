module.exports = function (stepsMapBuilder, stepsMapRunner, buildDefinitionRepository, projectRepository, validator) {

    return [
        {
            method: 'get',
            path: '/api/build-definition',
            middlewares: [
                (req, res) => {
                    buildDefinitionRepository
                        .list({})
                        .then(buildDefinitions => buildDefinitions.toArray())
                        .then(buildDefinition => {
                            res.json({ data: buildDefinition });
                        });
                }
            ]
        },
        {
            method: 'get',
            path: '/api/build-definition/:buildDefinitionId',
            middlewares: [
                (req, res) => {
                    let stepsMap = {};

                    stepsMapBuilder.addFindBuildDefinitionByIdStep(stepsMap, req.params.buildDefinitionId);
                    stepsMapBuilder.addFindProjectByBuildDefinitionStep(stepsMap);

                    stepsMapRunner
                        .run(stepsMap)
                        .then(resolutions => {
                            let data = JSON.parse(
                                JSON.stringify(resolutions.buildDefinition)
                            );
                            delete data.projectId;
                            data.project = {
                                _id: resolutions.project._id,
                                name: resolutions.project.name
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
            path: '/api/build-definition',
            middlewares: [
                (req, res) => {

                    function validateRequest() {
                        return validator
                            .validate(req.body, 'api.buildDefinition.addBuildDefinition');
                    }

                    function validateConfig() {
                        var config = req.body.config; // TODO Handle errors.

                        return validator
                            .validate(config, 'buildDefinitionConfig.root')
                            .then(() => config);
                    }

                    function persistDocument([config]) {
                        var buildDefinitionDocument = {
                            projectId: req.body.projectId,
                            name: req.body.name,
                            config: config
                        };

                        return buildDefinitionRepository
                            .add(buildDefinitionDocument)
                    }

                    function respondWithId(id) {
                        res.status(201).json({ data: { id: id } });
                    }

                    function respondWithErrors(errors) {
                        console.log('ERRORS', errors);
                        res.status(400).send();
                    }

                    validateRequest()
                        .then(() => {
                            return Promise.all([
                                validateConfig(),
                                projectRepository.getOrFail(req.body.projectId)
                            ]);
                        })
                        .then(persistDocument)
                        .then(respondWithId)
                        .catch(respondWithErrors);
                }
            ]
        }
    ];

};
