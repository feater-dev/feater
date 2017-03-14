var Client = require('github');

module.exports = function (config) {

    var client = new Client({
        debug: config.github.debugMode,
        protocol: 'https',
        host: 'api.github.com',
        headers: {
            'user-agent': 'XSolve Feat'
        },
        Promise: require('bluebird'),
        followRedirects: false,
        timeout: 20000
    });

    function authenticateClient() {
        client.authenticate({
            type: 'token',
            token: config.github.personalAccessToken
        });
    }

    function addRepoFullNameToParams(params, repoFullName) {
        var repoFullNameSplit = repoFullName.split('/');

        params.owner = repoFullNameSplit[0];
        params.repo = repoFullNameSplit[1];

        return params;
    }

    function handleError(error) {
        // TODO Handle error.
        console.log('GitHub communication failed.', error);

        throw new Error('GitHub communication failed.');
    }

    function getRepo(repoFullName) {
        authenticateClient(client);

        return client
            .repos
            .get(addRepoFullNameToParams({}, repoFullName))
            .error(handleError);
    }

    function getReference(repoFullName, reference) {
        authenticateClient(client);

        return client
            .gitdata
            .getReference(addRepoFullNameToParams({
                ref: reference
            }, repoFullName))
            .error(handleError);
    }

    function getCommit(repoFullName, commitSha) {
        authenticateClient(client);

        return client
            .repos
            .getCommit(addRepoFullNameToParams({ sha: commitSha }, repoFullName))
            .error(handleError);
    }

    function getTagReference(repoFullName, tagName) {
        return getReference(repoFullName, 'tags/' + tagName);
    }

    function getTagCommit(repoFullName, tagName) {
        return getTagReference(repoFullName, tagName)
            .then(function (tagReference) {
                return getCommit(repoFullName, tagReference.object.sha);
            });
    }

    function getBranchReference(repoFullName, branchName) {
        return getReference(repoFullName, 'heads/' + branchName);
    }

    function getBranchCommit(repoFullName, branchName) {
        return getBranchReference(repoFullName, branchName)
            .then(function (branchReference) {
                return getCommit(repoFullName, branchReference.object.sha);
            });
    }

    function getFile(repoFullName, reference, filePath) {
        authenticateClient(client);

        return client
            .repos
            .getContent(addRepoFullNameToParams({
                path: filePath,
                ref: reference
            }, repoFullName))
            .error(handleError);
    }

    function getFileContent(repoFullName, reference, filePath) {
        return getFile(repoFullName, reference, filePath)
            .then(function (file) {
                return new Buffer(file.content, 'base64').toString('ascii');
            });
    }

    return {
        getRepo,
        getCommit,
        getTagCommit,
        getBranchCommit,
        getFileContent
    };

};
