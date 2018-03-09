module.exports = function (stepsMapBuilder, stepsMapRunner, projectRepository, validator) {

    return [
        {
            method: 'get',
            path: '/api/project',
            middlewares: [
                (req, res) => {
                    projectRepository
                        .list({})
                        .then(projects => projects.toArray())
                        .then(projects => {
                            res.json({ data: projects });
                        });
                }
            ]
        },
        {
            method: 'get',
            path: '/api/project/:projectId',
            middlewares: [
                (req, res) => {
                    let stepsMap = {};

                    stepsMapBuilder.addFindProjectByIdStep(stepsMap, req.params.projectId);

                    stepsMapRunner
                        .run(stepsMap)
                        .then(resolutions => {
                            let data = JSON.parse(
                                JSON.stringify(resolutions.project)
                            );

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
            path: '/api/project',
            middlewares: [
                (req, res) => {
                    validator
                        .validate(req.body, 'api.project.addProject')
                        .then(
                            () => {
                                let project = req.body;
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

};
