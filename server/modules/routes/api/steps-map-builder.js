module.exports = function (projectRepository, buildDefinitionRepository, buildInstanceRepository) {

    return {

        addFindProjectByIdStep: (stepsMap, id) => {
            stepsMap.project = {
                dependsOn: [],
                callback: () => {
                    return projectRepository
                        .get(id)
                        .then(project => {
                            if (null === project) {
                                throw new Error('Project not found.');
                            }

                            return project;
                        });
                }
            };
        },

        addFindProjectByBuildDefinitionStep: stepsMap => {
            stepsMap.project = {
                dependsOn: ['buildDefinition'],
                callback: resolutions => {
                    return projectRepository
                        .get(resolutions.buildDefinition.projectId)
                        .then(project => {
                            if (null === project) {
                                throw new Error('Project not found.');
                            }

                            return project;
                        });
                }
            };
        },

        addFindBuildDefinitionByIdStep: (stepsMap, id) => {
            stepsMap.buildDefinition = {
                dependsOn: [],
                callback: () => {
                    return buildDefinitionRepository
                        .get(id)
                        .then(buildDefinition => {
                            if (null === buildDefinition) {
                                throw new Error('Build definition not found.');
                            }

                            return buildDefinition;
                        });
                }
            };
        },

        addFindBuildDefinitionByBuildInstanceStep: stepsMap => {
            stepsMap.buildDefinition = {
                dependsOn: ['buildInstance'],
                callback: resolutions => {
                    console.log(resolutions);
                    return buildDefinitionRepository
                        .get(resolutions.buildInstance.buildDefinitionId)
                        .then(buildDefinition => {
                            if (null === buildDefinition) {
                                throw new Error('Build definition not found.');
                            }

                            return buildDefinition;
                        });
                }
            };
        },

        addFindBuildInstanceByIdStep: (stepsMap, id) => {
            stepsMap.buildInstance = {
                dependsOn: [],
                callback: () => {
                    return buildInstanceRepository
                        .get(id)
                        .then(buildInstance => {
                            if (null === buildInstance) {
                                throw new Error('Build instance not found.');
                            }

                            return buildInstance;
                        });
                }
            };
        }

    };

};
