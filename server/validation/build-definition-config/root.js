module.exports = {
    "type":"object",
    "required":[
        "components",
        "exposedPorts",
        "composeFile",
        "environmentalVariables"
    ],
    "properties":{
        "components":{
            "type":"object",
            "patternProperties":{
                "^[_a-zA-Z\\d]+$":{
                    "required":[
                        "source",
                        "reference",
                        "beforeBuildTasks"
                    ],
                    "properties":{
                        "source":{
                            "type":"object",
                            "required":[
                                "type"
                            ],
                            "properties":{
                                "type":{
                                    "type":"string",
                                    "minLegth":1
                                }
                            }
                        },
                        "reference":{
                            "type":"object",
                            "required":[
                                "type",
                                "name"
                            ],
                            "properties":{
                                "type":{
                                    "type":"string",
                                    "minLength":1
                                },
                                "name":{
                                    "type":"string",
                                    "minLength":1
                                }
                            }
                        },
                        "beforeBuildTasks":{
                            "type":"array",
                            "items":{
                                "type":"object",
                                "required":[
                                    "type"
                                ],
                                "properties":{
                                    "type":{
                                        "type":"string",
                                        "minLength":1
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "additionalProperties":false
        },
        "exposedPorts":{
            "type":"object",
            "patternProperties":{
                "^[_a-zA-Z\\d]+$":{
                    "type":"array",
                    "items": {
                        "type": "object",
                        "required": [
                            "id",
                            "name",
                            "port"
                        ],
                        "properties": {
                            "id": {
                                "type": "string",
                                "minLength": 1
                            },
                            "name": {
                                "type": "string",
                                "minLength": 1
                            },
                            "port": {
                                "type": "number"
                            }
                        },
                        "additionalProperties": false
                    }
                }
            },
            "additionalProperties":false
        },
        "composeFile":{
            "type":"object",
            "required":[
                "componentId",
                "relativePath"
            ],
            "properties":{
                "componentId":{
                    "type":"string",
                    "minLength":1
                },
                "relativePath":{
                    "type":"string",
                    "minLength":1
                }
            }
        },
        "environmentalVariables":{
            "type":"object",
            "patternProperties":{
                "^(?!FEAT__)[A-Z\\d_]+$":{
                    "type":"string"
                }
            },
            "additionalProperties":false
        }
    }
};
