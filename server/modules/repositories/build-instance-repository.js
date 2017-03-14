var Promise = require('bluebird');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

module.exports = function (mongodbHelper) {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('buildInstance')
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

    function get(buildInstanceId) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('buildInstance')
                        .findOne({_id: mongodb.ObjectID(buildInstanceId)}, function (err, buildInstance) {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(buildInstance);
                        });
                });
            });
    }

    function getOrFail(buildInstanceId) {
        return get(buildInstanceId)
            .then(function (buildInstance) {
                if (null === buildInstance) {
                    throw new Error("Document not found.");
                }

                return buildInstance;
            });
    }

    function add(buildInstance) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('buildInstance')
                        .insertOne(buildInstance, null, function (err, result) {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(result.insertedId);
                        });
                });
            });
    }

    function updateExternalPorts(buildInstance) {
        return update(
            buildInstance,
            {'$set': {externalPorts: buildInstance.externalPorts}}
        );
    }

    function updateEnvironmentalVariables(buildInstance) {
        return update(
            buildInstance,
            {'$set': {environmentalVariables: buildInstance.environmentalVariables}}
        );
    }

    function updateSummaryItems(buildInstance) {
        return update(
            buildInstance,
            {'$set': {summaryItems: buildInstance.summaryItems}}
        );
    }

    function update(buildInstance, updateContents) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('buildInstance')
                        .updateOne(
                            {_id: ObjectID(buildInstance.id)},
                            updateContents,
                            {w: 1},
                            function (err, result) {
                                if (err) {
                                    reject(err);

                                    return;
                                }

                                resolve(result.insertedId);
                            }
                        );
                });
            });
    }

    return {
        list,
        get,
        getOrFail,
        add,
        updateExternalPorts,
        updateEnvironmentalVariables,
        updateSummaryItems
    };

};
