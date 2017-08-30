var mongodb = require('mongodb');

module.exports = function (mongodbHelper) {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('project')
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

    function get(projectId) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('project')
                        .findOne({ _id: mongodb.ObjectID(projectId) }, function (err, project) {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(project);
                        });
                });
            });
    }

    function getOrFail(projectId) {
        return get(projectId)
            .then(function (project) {
                if (null === project) {
                    throw new Error("Document not found.");
                }

                return project;
            });
    }

    function add(project) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('project')
                        .insertOne(project, null, function (err, result) {
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
