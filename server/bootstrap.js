var _ = require('underscore');
var path = require('path');

module.exports = (function () {

    function createApp() {
        var express = require('express');
        var serveFavicon = require('serve-favicon');
        var methodOverride = require('method-override');
        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var morgan = require('morgan');

        var app = express();

        app.use(express.static(__dirname + '/public'));
        app.use(serveFavicon(__dirname + '/public/favicon.ico'));
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
        var rawConfig = require('ini-config')(__dirname);

        rawConfig.apply('dev'); // TODO Use some env variable.

        var modules = require(__dirname + '/modules/index');
        var container = require(__dirname + '/container')(app, rawConfig, modules);

        return container;
    }

    function initializeAuth(app, container) {
        var passport = require('passport');
        var GoogleOAuth2Strategy = require('passport-google-oauth').OAuth2Strategy;
        var config = container.getModule('config');

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
        var title = 'XSolve Feat ' + container.getModule('config').app.versionNumber; // TODO Move it somewhere else.

        var routes = _.flatten(
            [
                // TODO Add route for serving client app.

                container.getModule('routes.auth.google'),
                container.getModule('routes.api.project'),
                container.getModule('routes.api.buildDefinition'),
                container.getModule('routes.api.build')
            ],
            true
        );

        routes.forEach(function (route) {
            app[route.method].apply(app, _.flatten([route.path, route.middlewares], true));
        });

        // Serve SPA
        app.use(function(req, res, next) {
            res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
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
