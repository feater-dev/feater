var Validator = require('jsonschema').Validator;
var Promise = require('bluebird');

module.exports = function () {

    var schemas = {
        // API request models.
        'api.project.addProject': require(__dirname + '/../validation/api/project/add-project'),
        'api.buildDefinition.addBuildDefinition': require(__dirname + '/../validation/api/build-definition/add-build-definition'),
        'api.buildInstance.addBuildInstance': require(__dirname + '/../validation/api/build-instance/add-build-instance'),

        // Build definiction config YAML.
        'buildDefinitionConfig.root': require(__dirname + '/../validation/build-definition-config/root')
    };

    function validate(data, schemaName) {
        var validator = new Validator();

        return new Promise(function (resolve, reject) {
            var result = validator.validate(data, schemas[schemaName]);

            if (result.errors.length) {
                reject(result.errors);

                return;
            }

            resolve();
        });
    }

    return {
        validate: validate
    };

};
