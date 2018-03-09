module.exports = {
    "type": "object",
    "required": [
        "buildDefinitionId",
        "name"
    ],
    "properties": {
        "buildDefinitionId": {
            "type": "string",
            "pattern": "^[a-f\\d]{24}$"
        },
        "name": {
            "type": "string",
            "minLength": 1
        }
    }
};
