var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');

module.exports = function (config) {

    function getMongo() {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(config.mongo.dsn, function (err, mongo) {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(mongo);
            });
        });
    }

    return {
        getMongo: getMongo
    };

};
