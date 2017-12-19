var flash = require('connect-flash');

module.exports = function (app, passport) {
    var responseGenerator = require('./../libraries/responseGenerator');
    var token;
    var jwt = require('jsonwebtoken');
    var jwtSecret = "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe";
    var decodedToken;

    var authentication = function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Authentication failed' });
                } else {
                    decodedToken = decoded;
                    next();
                }
            });
        }
    }

    app.get('/authentication/facebook', passport.authorize('facebook', { scope: ['email'] }));

    app.get('/authentication/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function (req, res) {
        var user = req.user;
        token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60),
            id: user._id,
            name: user.name
        }, jwtSecret);

        var response = responseGenerator.generate(false, "Authentication successful. Logged In", 200, user);
        response.token = token;
        res.json(response);
    });
};