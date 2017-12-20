//importing required modules
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var session = require('express-session');
var methodOverride = require('method-override');//use http terms like PUT and DELETE
var fs = require('fs');
var cors = require('cors');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');//used to parse incoming request by req.body

var err, response; //required variables


app.use(cors({
    origin: '*',
    withCredentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, './public')));

require('./configuration/passport')(passport);//passport module loaded from another file.

app.use(passport.initialize());//initializing passport service
app.use(passport.session());//for persistent login sessions
app.use(flash());//used to store flash messages in session

var responseGenerator = require('./libraries/responseGenerator');
var userModel = require('./models/User');

var Routes = require('./controllers/routes');
app.use('/users', Routes);//use routes controller on users route

var examRoutes = require('./controllers/examRoutes');
app.use('/tests', examRoutes);//use exam controllers on tests route

require('./controllers/fbRoute')(app, passport);
require('./controllers/googleRoute')(app, passport);

var userAuthentication = require('./models/userAuthentication');//invoking mongoose models
var googleAuthentication = require('./models/googleAuthentication');

app.get('/getuserinfofacebook', function (req, res) { //facebook route
    userAuthentication.find(function (error, user) {
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong. Error: " + error, 500, null);
            res.json(err);
        } else {
            response = responseGenerator.generate(false, "User info access was successful", 200, user);
            res.json(user);
        }
    });
});


app.get('/getuserinfogoogle', function (req, res) { //google user info route
    googleAuthentication.find(function (error, user) {
        if (error) {
            err = responseGenerator.generate(true, "Something is wrong. Error: " + error, 500, null);
            res.json(err);
        } else {
            response = responseGenerator.generate(false, "User info fetched successfully", 200, user);
            res.json(user);
        }
    });
});


var database = require('./configuration/database');
mongoose.connect(database.url);
mongoose.connection.once('open', function () {
    console.log("Database connected");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    if (req.accepts('json')) {
        res.send({ error: 'Not Found' });
        return;
    }
    res.send('Not Found');
});


var port = 3000;

app.listen(port, function () {
    console.log("Exam App running on localhost:" + port);
});