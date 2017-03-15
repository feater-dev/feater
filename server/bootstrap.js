const _ = require('underscore');
const path = require('path');

module.exports = ((() => {

    function createApp() {
        const express = require('express');
        const serveFavicon = require('serve-favicon');
        const methodOverride = require('method-override');
        const cookieParser = require('cookie-parser');
        const bodyParser = require('body-parser');
        const morgan = require('morgan');

        const app = express();

        app.use(express.static(`${__dirname}/public`));
        app.use(serveFavicon(`${__dirname}/public/favicon.ico`));
        app.use(morgan('dev'));

        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(bodyParser.json({ type: 'app/vnd.api+json' }));
        app.use(methodOverride());
        app.set('view engine', 'pug');
        app.set('views', `${__dirname}/views`);

        return app;
    }

    function createContainer(app) {
        const rawConfig = require('ini-config')(__dirname);

        rawConfig.apply('dev'); // TODO Use some env variable.

        const modules = require(`${__dirname}/modules/index`);
        const container = require(`${__dirname}/container`)(app, rawConfig, modules);

        return container;
    }

    function initializeAuth(app, container) {
        const expressSession = require('express-session');
        const ExpressSessions = require('express-sessions');
        const passport = require('passport');
        const GoogleOAuth2Strategy = require('passport-google-oauth').OAuth2Strategy;
        const redis = require('redis');
        const config = container.getModule('config');

        app.use(expressSession({
            secret: 'someSessionSecret',
            cookie: {
                maxAge: 2628000000
            },
            store: new ExpressSessions({
                storage: 'redis',
                instance: redis.createClient(config.redis.dsn),
                collection: 'sessions',
                expire: 86400
            })
        }));

        app.use(passport.initialize());

        app.use(passport.session());

        passport.use(new GoogleOAuth2Strategy(
            {
                clientID: config.googleOAuth2.clientId,
                clientSecret: config.googleOAuth2.clientSecret,
                callbackURL: `${config.web.baseUrl}/auth/google/callback`
            },
            (accessToken, refreshToken, profile, done) => {

                process.nextTick(() => {
                    if (!_.contains(config.googleOAuth2.allowedDomains, profile._json.domain)) {
                        // TODO Do something for this error not being shown.

                        return done(new Error(
                            `Invalid domain, allowed domains are ${_.map(config.googleOAuth2.allowedDomains, allowedDomain => `'${allowedDomain}'`).join(', ')}.`
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

        passport.serializeUser((user, done) => // TODO How this should be handled?
            done(null, JSON.stringify(user)));

        passport.deserializeUser((serializedUser, done) => // TODO How this should be handled?
            done(null, JSON.parse(serializedUser)));
    }

    function registerRoutes(app, container) {
        const routes = _.flatten(
            [
                // TODO Add route for serving client app.

                container.getModule('routes.auth.google'),
                container.getModule('routes.api.project'),
                container.getModule('routes.api.buildDefinition'),
                container.getModule('routes.api.buildInstance')
            ],
            true
        );

        routes.forEach(route => {
            app[route.method].apply(app, _.flatten([route.path, route.middlewares], true));
        });

        // Serve SPA
        app.use((req, res) => {
            res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
        });
    }

    return () => {
        const app = createApp();
        const container = createContainer(app);

        initializeAuth(app, container);
        registerRoutes(app, container);

        return container;
    };

}))();
