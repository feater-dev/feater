var mongodb = require('mongodb');

module.exports = function (mongodbHelper) {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(mongo => {
                return new Promise((resolve, reject) => {
                    mongo
                        .collection('buildDefinition')
                        .find(query, (err, result) => {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(result);
                        });
                });
            });
    }

    function get(buildDefinitionId) {
        return mongodbHelper
            .getMongo()
            .then(mongo => {
                return new Promise((resolve, reject) => {
                    mongo
                        .collection('buildDefinition')
                        .findOne({ _id: mongodb.ObjectID(buildDefinitionId) }, (err, buildDefinition) => {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(buildDefinition);
                        });
                });
            });
    }

    function getOrFail(buildDefinitionId) {
        return get(buildDefinitionId)
            .then(buildDefinition => {
                if (null === buildDefinition) {
                    throw new Error("Document not found.");
                }

                return buildDefinition;
            });
    }

    function add(buildDefinition) {
        return mongodbHelper
            .getMongo()
            .then(mongo => {
                return new Promise((resolve, reject) => {
                    buildDefinition.projectId = new mongodb.ObjectID(buildDefinition.projectId);

                    mongo
                        .collection('buildDefinition')
                        .insertOne(buildDefinition, null, (err, result) => {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(result.insertedId);
                        });
                });
            });
    }

    return {
        list,
        get,
        getOrFail,
        add
    };

};
