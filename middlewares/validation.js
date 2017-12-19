exports.login = function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(400).end("Enter valid email and password");
    } else {
        next();
    }
}

exports.reset = function (req, res, next) {
    console.log("Reset");
    if (!req.body.email) {
        res.status(400).end("Enter a valid email");
    } else {
        next();
    }
}

exports.signup = function (req, res, next) {
    console.log("Signup");
    if (!req.body.name || !req.body.email || !req.body.mobile || !req.body.password || !req.body.security || !req.body.answer) {
        res.status(400).end("Enter all signup info");
    } else {
        console.log("signup validated");
        next();
    }
}
