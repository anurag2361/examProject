var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
var userAuthentication = require('../models/userAuthentication');
var configAuthentication = require('./authentication');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new facebookStrategy({
        clientID: configAuthentication.facebookAuth.clientID,
        clientSecret: configAuthentication.facebookAuth.clientSecret,
        callbackURL: configAuthentication.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName']
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                userAuthentication.findOne({ 'id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    } if (user) {
                        return done(null, user);
                    } else {
                        console.log(profile);
                        var newUser = new userAuthentication();
                        newUser.id = profile.id;
                        newUser.name = profile.displayName;

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);

                        })
                    }
                });
            });
        }
    ));
};