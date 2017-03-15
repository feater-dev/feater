module.exports = function (projectRepository, validator) {

    return [
        {
            method: 'get',
            path: '/api/project',
            middlewares: [
                function (req, res) {
                    projectRepository
                        .list({})
                        .then(function (projects) {
                            projects
                                .toArray()
                                .then(function (projects) {
                                    res.json({ data: projects });
                                });
                        });
                }
            ]
        },
        {
            method: 'get',
            path: '/api/project/:projectId',
            middlewares: [
                function (req, res) {
                    projectRepository
                        .get(req.params.projectId)
                        .then(function (project) {
                            if (null === project) {
                                res.status(404).send();

                                return;
                            }

                            res.json({ data: project });
                        });
                }
            ]
        },
        {
            method: 'post',
            path: '/api/project',
            middlewares: [
                function (req, res) {
                    validator
                        .validate(req.body, 'api.project.addProject')
                        .then(
                            function () {
                                var project = req.body;
                                projectRepository
                                    .add(project)
                                    .then(function (projectId) {
                                        res.status(201).json({ data: { id: projectId } });
                                    });
                            },
                            function (errors) {
                                console.log('ERRORS', errors);
                                res.status(400).send();
                            }
                        );
                }
            ]
        }
    ];

};
