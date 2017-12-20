var express = require('express');
var app = express.Router(); //for routing purposes
var mongoose = require('mongoose');
var User = mongoose.model('User');
var responseGenerator = require('../libraries/responseGenerator');
var validation = require('../middlewares/validation');

var token;
var jwt = require('jsonwebtoken');
var jwtSecret = "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe";
var decodedToken;

var err, response;

var authentication = function (req, res, next) {
    token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Token authentication failed' });
            } else {
                decodedToken = decoded;
                console.log("Token decoded");
                console.log(decodedToken);
                next();
            }
        });
    }
}

app.post('/login', validation.login, function (req, res) { //login and signup pass through validation middleware
    User.findOne({ email: req.body.email }, function (error, user) {
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong: " + error, 500, null);
            res.json(err);
        } else if (user === null || user === undefined || user.name === null || user.name === undefined) {
            response = responseGenerator.generate(true, "No user found. Enter correct email", 400, null);
            res.json(response);
        } else if (!user.compareHash(req.body.password)) {
            response = responseGenerator.generate(true, "Wrong password. Enter correct password", 401, null);
            res.json(response);
        } else {  //sign token if all ok
            token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
                id: user._id,
                email: user.email,
                name: user.name,
                mobile: user.mobile
            }, jwtSecret);

            response = responseGenerator.generate(false, "Logged In", 200, user);
            response.token = token;
            res.json(response);
        }
    });
});

app.post('/signup', validation.signup, function (req, res) {
    User.findOne({ email: req.body.email }, function (error, user) {
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong. Error: " + error, 500, null);
            res.json(err);
        } else if (user) {
            err = responseGenerator.generate(true, "Email exists", 400, null);
            res.json(err);
        } else { //create new user
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                security: req.body.security,
                answer: req.body.answer
            });

            newUser.password = newUser.generateHash(req.body.password); //create a hash of user password
            newUser.save(function (error) {
                if (error) {
                    response = responseGenerator.generate(true, "Something was wrong. Error: " + error, 500, null);
                    res.json(response);
                } else {
                    token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        id: newUser._id,
                        email: newUser.email,
                        name: newUser.name,
                        mobile: newUser.mobile
                    }, jwtSecret);

                    response = responseGenerator.generate(false, "Signed Up", 200, newUser);
                    response.token = token;
                    res.json(response);
                }
            });
        }
    });
});

app.post('/reset', validation.reset, function (req, res) { //password reset
    //console.log("Reset activated");
    User.findOne({ email: req.body.email }, function (error, user) { //reads email
        console.log("User: " + user);
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong. Error: " + error, 500, null);
            res.json(err);
        } else if (user === null || user === undefined || user.name === null || user.name === undefined) {
            response = responseGenerator.generate(true, "No User Found", 400, null);
            res.json(response);
        } else {
            token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
                id: user._id,
                email: user.email,
                name: user.name,
                mobile: user.mobile
            }, jwtSecret);

            response = responseGenerator.generate(false, "Reset Done", 200, user);
            response.token = token;
            res.json(response);
        }
    });
});

app.post('/SecurityQuestion', function (req, res) { //ask security question
    //console.log("Security question activated");
    User.findOne({ _id: req.body._id }, function (error, user) {
        console.log("User= " + user);
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong. Error: " + error, 500, null);
            res.json(err);
        } else if (user === null || user === undefined || user.security === null || user.security === undefined) {
            response = responseGenerator.generate(true, "Initialize some security questions first.", 400, null);
            res.json(response);
        } else {
            token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
                id: user._id,
                email: user.email,
                name: user.name,
                mobile: user.mobile
            }, jwtSecret);

            response = responseGenerator.generate(false, "Security questions accessed", 200, user);
            response.token = token;
            res.json(response);
        }
    });
});

app.post('/ResetPassword', function (req, res) { //password reset completes here
    //console.log("Reset password realm");
    User.findOne({ $and: [{ 'answer': req.body.answer }, { '_id': req.body._id }] }, function (error, user) {
        console.log("User: " + user);
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong " + error, 500, null);
            res.json(err);
        } else if (user === null || user === undefined || user.answer === null || user.answer === undefined) {
            response = responseGenerator.generate(true, "Incorrect Answer) ", 400, null);
            res.json(response);
        } else {

            user.password = user.generateHash(req.body.password);
            user.save(function (error) {
                if (error) {
                    response = responseGenerator.generate(true, "Something was wrong : " + error, 500, null);
                    res.json(response);
                } else {

                    token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        mobile: user.mobile
                    }, jwtSecret);

                    response = responseGenerator.generate(false, "Successfully changed the password!!!", 200, user);
                    response.token = token;
                    res.json(response);
                }

            });
        }
    });
});

app.get('/getuserinfo', authentication, function (req, res) { //retrieve user info
    User.find(function (error, user) {
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong. Error: " + error, 500, null);
            res.json(err);
        } else {
            response = responseGenerator.generate(false, "Retrieved info", 200, user);
            response.token = token;
            res.json(response);
        }
    });
});


module.exports = app;
