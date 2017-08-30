var mongodb = require('mongodb');

module.exports = function (mongodbHelper) {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('user')
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

    function get(userId) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('user')
                        .findOne({ _id: mongodb.ObjectID(userId) }, function (err, user) {
                            if (err) {
                                reject(err);

                                return;
                            }

                            resolve(user);
                        });
                });
            });
    }

    function add(user) {
        return mongodbHelper
            .getMongo()
            .then(function (mongo) {
                return new Promise(function (resolve, reject) {
                    mongo
                        .collection('user')
                        .insertOne(user, null, function (err, result) {
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
        add
    };

};
