const Promise = require('bluebird');
const mongodb = require('mongodb');

module.exports = mongodbHelper => {

    function list(query) {
        return mongodbHelper
            .getMongo()
            .then(mongo => new Promise((resolve, reject) => {
                mongo
                    .collection('user')
                    .find(query, (err, result) => {
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(result);
                    });
            }));
    }

    function get(userId) {
        return mongodbHelper
            .getMongo()
            .then(mongo => new Promise((resolve, reject) => {
                mongo
                    .collection('user')
                    .findOne({ _id: mongodb.ObjectID(userId) }, (err, user) => {
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(user);
                    });
            }));
    }

    function add(user) {
        return mongodbHelper
            .getMongo()
            .then(mongo => new Promise((resolve, reject) => {
                mongo
                    .collection('user')
                    .insertOne(user, null, (err, { insertedId }) => {
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(insertedId);
                    });
            }));
    }

    return {
        list,
        get,
        add
    };

};
