var mongodb = require('mongodb');

module.exports = function (mongodbHelper) {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(mongo => {
                return new Promise((resolve, reject) => {
                    mongo
                        .collection('user')
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

    function get(userId) {
        return mongodbHelper
            .getMongo()
            .then(mongo => {
                return new Promise((resolve, reject) => {
                    mongo
                        .collection('user')
                        .findOne({ _id: mongodb.ObjectID(userId) }, (err, user) => {
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
            .then(mongo => {
                return new Promise((resolve, reject) => {
                    mongo
                        .collection('user')
                        .insertOne(user, null, (err, result) => {
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
