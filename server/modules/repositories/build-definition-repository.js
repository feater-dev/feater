var Promise = require('bluebird');
var mongodb = require('mongodb');

module.exports = function (mongodbHelper) {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('buildDefinition')
                        .find(query, function (err, result) {
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
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('buildDefinition')
                        .findOne({ _id: mongodb.ObjectID(buildDefinitionId) }, function (err, buildDefinition) {
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
            .then(function (buildDefinition) {
                if (null === buildDefinition) {
                    throw new Error("Document not found.");
                }

                return buildDefinition;
            });
    }

    function add(buildDefinition) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    buildDefinition.projectId = new mongodb.ObjectID(buildDefinition.projectId);

                    mongo
                        .collection('buildDefinition')
                        .insertOne(buildDefinition, null, function (err, result) {
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
