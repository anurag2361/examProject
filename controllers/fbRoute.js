var flash = require('connect-flash');// for session stored flash messages

var responseGenerator = require('./../libraries/responseGenerator');
var token, authentication, response;
var jwt = require('jsonwebtoken');
var jwtSecret = "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe";
var decodedToken;


module.exports = function (app, passport) {

    authentication = function (req, res, next) {
        token = req.body.token || req.query.token || req.headers['x-access-token'];//checking header,query and body parameters for tokens
        if (token) {
            jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Authentication failed' });
                } else {
                    decodedToken = decoded; //token passed
                    next();
                }
            });
        }
    }

    app.get('/authentication/facebook', passport.authorize('facebook', { scope: ['email'] }));

    app.get('/authentication/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function (req, res) {
        var user = req.user;
        token = jwt.sign({ //signing token
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
            id: user._id,
            name: user.name
        }, jwtSecret);

        response = responseGenerator.generate(false, "Authentication successful. Logged In", 200, user);
        response.token = token;
        res.json(response);
    });
};