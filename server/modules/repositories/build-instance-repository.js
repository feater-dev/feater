const Promise = require('bluebird');
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;

module.exports = mongodbHelper => {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(mongo => new Promise((resolve, reject) => {
                mongo
                    .collection('buildInstance')
                    .find(query, (err, result) => {
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(result);
                    });
            }));
    }

    function get(buildInstanceId) {
        return mongodbHelper
            .getMongo()
            .then(mongo => new Promise((resolve, reject) => {
                mongo
                    .collection('buildInstance')
                    .findOne({ _id: mongodb.ObjectID(buildInstanceId) }, (err, buildInstance) => {
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(buildInstance);
                    });
            }));
    }

    function getOrFail(buildInstanceId) {
        return get(buildInstanceId)
            .then(buildInstance => {
                if (null === buildInstance) {
                    throw new Error("Document not found.");
                }

                return buildInstance;
            });
    }

    function add(buildInstance) {
        return mongodbHelper
            .getMongo()
            .then(mongo => new Promise((resolve, reject) => {
                mongo
                    .collection('buildInstance')
                    .insertOne(buildInstance, null, (err, { insertedId }) => {
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(insertedId);
                    });
            }));
    }

    function updateExternalPorts(buildInstance) {
        return update(
            buildInstance,
            { '$set': { externalPorts: buildInstance.externalPorts } }
        );
    }

    function updateEnvironmentalVariables(buildInstance) {
        return update(
            buildInstance,
            { '$set': { environmentalVariables: buildInstance.environmentalVariables } }
        );
    }

    function updateSummaryItems(buildInstance) {
        return update(
            buildInstance,
            { '$set': { summaryItems: buildInstance.summaryItems } }
        );
    }

    function update({ id }, updateContents) {
        return mongodbHelper
            .getMongo()
            .then(mongo => new Promise((resolve, reject) => {
                mongo
                    .collection('buildInstance')
                    .updateOne(
                        { _id: ObjectID(id) },
                        updateContents,
                        { w: 1 },
                        (err, { insertedId }) => {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(insertedId);
                        }
                    );
            }));
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
