let _ = require('underscore');

let container = require('./bootstrap')();

let app = container.getModule('app');
let config = container.getModule('config');

app.listen(config.app.port, function () {
    console.log(`XSolve Feat app listening on port ${config.app.port}.`);
});

//// Token example.
//
// var tokenGenerator = container.getModule('util.tokenGenerator');
//
// console.log('Sample token: ' + tokenGenerator.generate());

//// Some example GitHub API calls.
//
// var githubApiClient = container.getModule('githubApiClient');
//
// githubApiClient
//     .getRepo('xsolve-pl/xsolve-model-factory-bundle')
//     .then(function (repo) {
//         console.log(repo);
//     });
//
// githubApiClient
//     .getTagCommit('xsolve-pl/xsolve-model-factory-bundle', 'v1.0.3')
//     .then(function (commit) {
//         console.log(commit);
//     });
//
// githubApiClient
//     .getBranchCommit('xsolve-pl/xsolve-model-factory-bundle', 'master')
//     .then(function (commit) {
//         console.log(commit);
//     });
//
// githubApiClient
//     .getCommit('xsolve-pl/xsolve-model-factory-bundle', 'a38dfcfc1787309079cd23fd38b2e61d9ff365af')
//     .then(function (commit) {
//         console.log(commit);
//     });
//
// githubApiClient
//     .getFileContent('xsolve-pl/xsolve-model-factory-bundle', 'a38dfcfc1787309079cd23fd38b2e61d9ff365af', '.travis.yml')
//     .then(function (fileContent) {
//         console.log(fileContent);
//     });
