var passport = require('passport'); //invoking passport module
var facebookStrategy = require('passport-facebook').Strategy;//passport facebook strategy
var userAuthentication = require('../models/userAuthentication');
var configAuthentication = require('./authentication');

module.exports = function (passport) {  //serializing and deserializing user
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new facebookStrategy({  //providing necessary info for login
        clientID: configAuthentication.facebookAuth.clientID,
        clientSecret: configAuthentication.facebookAuth.clientSecret,
        callbackURL: configAuthentication.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName']
    },
        function (accessToken, refreshToken, profile, done) { // facebook will send back the token and profile
            process.nextTick(function () { // asynchronous
                userAuthentication.findOne({ 'id': profile.id }, function (err, user) { // find the user in the database based on their facebook id
                    if (err) { // if there is an error, stop everything and return that ie an error connecting to the database
                        return done(err);
                    } if (user) { // if the user is found, then log them in
                        return done(null, user);
                    } else {
                        console.log(profile);
                        var newUser = new userAuthentication(); // if there is no user found with that facebook id, create them
                        newUser.id = profile.id;
                        newUser.name = profile.displayName;

                        newUser.save(function (err) { // save our user to the database
                            if (err)
                                throw err;
                            return done(null, newUser); // if successful, return the new user

                        })
                    }
                });
            });
        }
    ));
};