const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

module.exports = ({ mongo }) => {

    function getMongo() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongo.dsn, (err, mongo) => {
                if (err) {
                    reject(err);

                    return;
                }

                resolve(mongo);
            });
        });
    }

    return {
        getMongo
    };

};
