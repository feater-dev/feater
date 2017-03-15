module.exports = (projectRepository, validator) => [
    {
        method: 'get',
        path: '/api/project',
        middlewares: [
            (req, res) => {
                projectRepository
                    .list({})
                    .then(projects => {
                        projects
                            .toArray()
                            .then(projects => {
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
            ({ params }, res) => {
                projectRepository
                    .get(params.projectId)
                    .then(project => {
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
            ({ body }, res) => {
                validator
                    .validate(body, 'api.project.addProject')
                    .then(
                        () => {
                            const project = body;
                            projectRepository
                                .add(project)
                                .then(projectId => {
                                    res.status(201).json({ data: { id: projectId } });
                                });
                        },
                        errors => {
                            console.log('ERRORS', errors);
                            res.status(400).send();
                        }
                    );
            }
        ]
    }
];
