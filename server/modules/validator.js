const Validator = require('jsonschema').Validator;
const Promise = require('bluebird');

module.exports = () => {

    const schemas = {
        // API request models.
        'api.project.addProject': require(`${__dirname}/../validation/api/project/add-project`),
        'api.buildDefinition.addBuildDefinition': require(`${__dirname}/../validation/api/build-definition/add-build-definition`),
        'api.buildInstance.addBuildInstance': require(`${__dirname}/../validation/api/build-instance/add-build-instance`),

        // Build definiction config YAML.
        'buildDefinitionConfig.root': require(`${__dirname}/../validation/build-definition-config/root`)
    };

    function validate(data, schemaName) {
        const validator = new Validator();

        return new Promise((resolve, reject) => {
            const result = validator.validate(data, schemas[schemaName]);

            if (result.errors.length) {
                reject(result.errors);

                return;
            }

            resolve();
        });
    }

    return {
        validate
    };

};
