var Promise = require('bluebird');

module.exports = function (buildDefinitionRepository, projectRepository, validator) {

    return [
        {
            method: 'get',
            path: '/api/build-definition',
            middlewares: [
                function (req, res) {
                    buildDefinitionRepository
                        .list({})
                        .then(function (buildDefinitions) {
                            buildDefinitions
                                .toArray()
                                .then(function (buildDefinition) {
                                    res.json({data: buildDefinition});
                                });
                        });
                }
            ]
        },
        {
            method: 'get',
            path: '/api/build-definition/:buildDefinitionId',
            middlewares: [
                function (req, res) {
                    var scope = {};

                    function findDocument() {
                        return buildDefinitionRepository
                            .get(req.params.buildDefinitionId)
                            .then(function (document) {
                                if (null === document) {
                                    res.status(404).send();

                                    return;
                                }

                                scope.document = document;
                            });
                    }

                    function findProject() {
                        return projectRepository
                            .get(scope.document.projectId)
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
                        delete data.projectId;
                        data.project = {
                            _id: scope.project._id,
                            name: scope.project.name
                        };

                        res.json({data});
                    }

                    function respondWithErrors(errors) {
                        console.log('ERRORS', errors);
                        res.status(400).send();
                    }

                    findDocument()
                        .then(findProject)
                        .then(respondWithData)
                        .catch(respondWithErrors);
                }
            ]
        },
        {
            method: 'post',
            path: '/api/build-definition',
            middlewares: [
                function (req, res) {

                    function validateRequest() {
                        return validator
                            .validate(req.body, 'api.buildDefinition.addBuildDefinition');
                    }

                    function validateConfig() {
                        var config = req.body.config; // TODO Handle errors.

                        return validator
                            .validate(config, 'buildDefinitionConfig.root')
                            .then(function () {
                                return config;
                            });
                    }

                    function persistDocument([config, project]) {
                        var buildDefinitionDocument = {
                            projectId: req.body.projectId,
                            name: req.body.name,
                            config: config
                        };

                        return buildDefinitionRepository
                            .add(buildDefinitionDocument)
                    }

                    function respondWithId(id) {
                        res.status(201).json({data: {id: id}});
                    }

                    function respondWithErrors(errors) {
                        console.log('ERRORS', errors);
                        res.status(400).send();
                    }

                    validateRequest()
                        .then(function () {
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
