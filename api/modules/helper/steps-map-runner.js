let _ = require('underscore');

module.exports = function () {

    function run(stepsMap) {
        let resolutionsMap = {};
        let runningStepsMap = {};

        return new Promise((resolve, reject) => {

            function tick() {
                if (_.isEmpty(stepsMap) && _.isEmpty(runningStepsMap)) {
                    resolve(resolutionsMap);

                    return;
                }

                let noStepsRun = true;
                _.each(stepsMap, ({ dependsOn, callback }, id) => {
                    if (_.isEmpty(_.difference(dependsOn, _.keys(resolutionsMap)))) {
                        noStepsRun = false;
                        runningStepsMap[id] = true;
                        delete stepsMap[id];

                        let stepResolutionsMap = {};
                        _.each(dependsOn, function (id) {
                            stepResolutionsMap[id] = resolutionsMap[id];
                        });

                        callback.call(null, stepResolutionsMap).then(
                            resolution => {
                                resolutionsMap[id] = resolution;
                                delete runningStepsMap[id];
                                tick();
                            },
                            error => {
                                reject(error);
                            }
                        );
                    }
                });

                if (noStepsRun && _.isEmpty(runningStepsMap)) {
                    reject(new Error('Inconsistent steps map, can\'t run all steps.'));
                }
            }

            tick();
        })
    }

    return {
        run
    };

};
