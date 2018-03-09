var _ = require('underscore');
var path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const GoogleOAuth2Strategy = require('passport-google-oauth').OAuth2Strategy;
const modules = require('./modules/index');
const rawConfig = require('ini-config')(__dirname);

module.exports = (function () {

    function createApp() {

        let app = express();

        app.use(morgan('dev'));

        app.use(cookieParser());

        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(bodyParser.json({type: 'app/vnd.api+json'}));

        app.use(methodOverride());
        app.set('view engine', 'pug');
        app.set('views', __dirname + '/views');

        return app;
    }

    function createContainer(app) {
        rawConfig.apply('dev'); // TODO Use some env variable.
        const container = require('./container')(app, rawConfig, modules);

        return container;
    }

    function initializeAuth(app, container) {
        const config = container.getModule('config');

        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new GoogleOAuth2Strategy(
            {
                clientID: config.googleOAuth2.clientId,
                clientSecret: config.googleOAuth2.clientSecret,
                callbackURL: config.app.baseUrl + '/auth/google/callback'
            },
            function(accessToken, refreshToken, profile, done) {

                process.nextTick(function () {
                    if (!_.contains(config.googleOAuth2.allowedDomains, profile._json.domain)) {
                        // TODO Do something for this error not being shown.

                        return done(new Error(
                            'Invalid domain, allowed domains are ' +
                            _.map(config.googleOAuth2.allowedDomains, function (allowedDomain) {
                                return '\'' + allowedDomain + '\'';
                            }).join(', ') +
                            '.'
                        ));
                    }

                    // TODO Find user or create one if needed, see https://scotch.io/tutorials/easy-node-authentication-google

                    return done(null, { // TODO What should be returned here?
                        googleProfileId: profile.id,
                        givenName: profile.name.givenName,
                        familyName: profile.name.familyName,
                        displayName: profile.displayName,
                        emailAddress: profile.emails[0].value,
                        domain: profile._json.domain
                    });
                });
            }
        ));

        passport.serializeUser(function(user, done) {
            // TODO How this should be handled?

            return done(null, JSON.stringify(user));
        });

        passport.deserializeUser(function(serializedUser, done) {
            // TODO How this should be handled?
            // console.log(JSON.parse(serializedUser));

            return done(null, JSON.parse(serializedUser));
        });
    }

    function registerRoutes(app, container) {
        const config = container.getModule('config');
        var title = `XSolve Feat ${config.app.versionNumber}`; // TODO Move it somewhere else.

        let routes = _.flatten([
            container.getModule('routes.auth.google'),
        ], true);

        routes.forEach(function (route) {
            app[route.method].apply(app, _.flatten([route.path, route.middlewares], true));
        });

        let corsRoutes = _.flatten([
            container.getModule('routes.api.project'),
            container.getModule('routes.api.buildDefinition'),
            container.getModule('routes.api.build')
        ], true);

        let corsRoutePaths = _.uniq(_.pluck(corsRoutes, 'path'));

        corsRoutePaths.forEach(corsRoutePath => {
            app.options(corsRoutePath, cors());
        });
        corsRoutes.forEach(corsRoute => {
            app[corsRoute.method].apply(app, _.flatten([corsRoute.path, cors(), corsRoute.middlewares], true));
        });
    }

    return function () {
        var app = createApp();
        var container = createContainer(app);

        initializeAuth(app, container);
        registerRoutes(app, container);

        return container;
    };

})();
