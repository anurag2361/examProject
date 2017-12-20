var express = require('express');
var app = express();
var server = require('http').createServer(app);
var passport = require('passport');
var util = require('util');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(require('morgan')('combined'));
var googleAuthentication = require('../models/googleAuthentication');

var GOOGLE_CLIENT_ID = " 518408673074-62ie395n257id8auss1gq1gneii3lcab.apps.googleusercontent.com ";
var GOOGLE_CLIENT_SECRET = " rY_kyNrvJE1QKTKBU0ZK_Fbu ";
var responseGenerator = require('../libraries/responseGenerator');
var token, authentication;
var jwt = require('jsonwebtoken');
var jwtSecret = "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe";
var decodedToken;

module.exports = function (app, passport) {

    authentication = function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token authentication failed'
                    });
                } else {
                    decodedToken = decoded;
                    next();
                }
            });
        }
    }

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackUrl: "http://ec2-13-127-92-66.ap-south-1.compute.amazonaws.com/auth/google/callback",
        realm: 'http://ec2-13-127-92-66.ap-south-1.compute.amazonaws.com/#/',
        passReqToCallback: true
    },
        function (request, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                googleAuthentication.findOne({
                    'id': profile.id
                }, function (err, user) {
                    console.log("Profile: " + profile);
                    console.log(user);
                    if (err)
                        return done(err);
                    if (user)
                        return done(null, user);
                    else {
                        var newUser = new googleAuthentication();
                        newUser.id = profile.id;
                        newUser.name = profile.displayName;
                        newUser.email = profile.emails[0].value;
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        })
                    }
                });
                return done(null, profile);
            });
        }
    ));


    app.get('/auth/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email']
    }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
        var user = req.user;
        token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
            id: user._id,
            email: user.email,
            name: user.name
        }, jwtSecret);

        var response = responseGenerator.generate(false, "Authentication done. Logged In", 200, user);
        response.token = token;
        res.json(response);
    });

    function ensureAuthentication(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("Hey " + req.user.displayName);
            return next();
        } else {
            res.send("Not Found");
        }
    }
}
