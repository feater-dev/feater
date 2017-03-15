const passport = require('passport');

module.exports = () => [
    {
        method: 'get',
        path: '/auth/google',
        middlewares: [
            passport.authenticate('google', {
                scope: ['profile', 'email']
            })
        ]
    },
    {
        method: 'get',
        path: '/auth/google/callback',
        middlewares: [
            passport.authenticate('google', {
                successRedirect: '/',
                failureRedirect: '/'
            })
        ]
    }
];
