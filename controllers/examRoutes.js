var mongoose = require('mongoose');
var express = require('express');
var examRouter = express.Router();
var Test = require('../models/test');
var Question = require('../models/question');
var Answer = require('../models/answer');
var Performance = require('../models/performance');
var responseGenerator = require('./../libraries/responseGenerator');

var error, response;

var token;
var jwt = require('jsonwebtoken');
var decodedToken;
var authentication = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, "98ix0b84gs3r@&$#*np9bgkpfjeib1f9ipe", function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Token authentication failed in test.' });
            } else {
                decodedToken = decoded;
                console.log("Token decoded");
                console.log(decodedToken);
                next();
            }
        });
    }
}


examRouter.post('/createTest/admin', authentication, function (req, res) {
    var test = new Test(req.body);
    console.log(test);
    test.save(function (err, test) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. " + err, 500, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Test creation was successful", 200, test);
            res.send(response);
        }
    });
});


examRouter.get('/allTests', authentication, function (req, res) {
    Test.find(function (err, tests) {
        console.log(tests);
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. " + err, 500, null);
            res.send(error);
        } else if (tests === [] || tests === undefined || tests === null) {
            error = responseGenerator.generate(true, "No tests found", 204, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "All tests recieved.", 200, tests);
            res.send(response);
        }
    });
});

examRouter.get('/test/:test_id', authentication, function (req, res) {
    Test.findById({ _id: req.params.test_id }, function (err, test) {
        console.log('test id is: ' + req.params.test_id);
        console.log(test);
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else if (test === null || test === undefined || test === []) {
            error = responseGenerator.generate(true, "No test recieved", 204, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Test recieved.", 200, test);
            res.send(response);
        }
    });
});

examRouter.put('/test/update/:test_id', authentication, function (req, res) {
    Test.findByIdAndUpdate({ _id: req.params.test_id }, req.body, function (err, test) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Updated test.", 200, test);
            res.send(response);
        }
    });
});

examRouter.delete('/test/delete/:test_id', authentication, function (req, res) {
    Test.findByIdAndRemove(req.params.test_id, function (err, test) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else if (test === null || test === undefined || test === []) {
            error = responseGenerator.generate(true, "Nothing recieved", 204, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Test deleted", 200, test);
            res.send(response);
        }
    });
});


examRouter.post('/:test_id/createQuestion', authentication, function (req, res) {
    var question = new Question(req.body);
    console.log("Question: " + question);
    Test.findById({ _id: req.params.test_id }, function (err, test) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Dont forget to remove '/' from Test ID Error: " + err, 500, null);
            res.send(error);
        } else {
            if (test.questions.length == 10) {
                error = responseGenerator.generate(true, "You can add only 10 questions. Remove slash and try again. Error: " + err, 500, null);
                res.send(error);
            } else {
                question.save();
                test.questions.push(question)
                test.save(function (err, test) {
                    if (err) {
                        error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
                        res.send(error);
                    } else if (question === null || question === undefined || question === []) {
                        error = responseGenerator.generate(true, "Nothing recieved", 204, null);
                        res.send(error);
                    } else {
                        response = responseGenerator.generate(false, "Question created", 200, question);
                        res.send(response);
                    }
                });
            }
        }
    });
});


examRouter.get('/:test_id/getQuestions', authentication, function (req, res) {
    Test.findById({ _id: req.params.test_id }, function (err, test) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else if (test === null || test === undefined || test === []) {
            error = responseGenerator.generate(true, "Nothing recieved", 204, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Questions recieved", 200, test.questions);
            res.send(response);
        }
    })
});


examRouter.get('/question/:test_id/:index/:question_id/delete', authentication, function (req, res) {
    Test.findOne({ _id: req.params.test_id }, function (err, test) {
        if (err) {
            error = responseGenerator.generate(true, "Remove slash(/) from test id. Error: " + err, 500, null);
            res.send(error);
        } else {
            if (test.questions.length == 0) {
                error = responseGenerator.generate(true, "No questions available. Error: " + err, 500, null);
                res.send(error);
            } else {
                Question.findByIdAndRemove(req.params.question_id);
                test.questions.splice(req.params.index, 1);
                console.log("Questions: " + test.questions);
                test.save(function (err, question) {
                    if (err) {
                        error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
                        res.send(error);
                    } else {
                        response = responseGenerator.generate(false, "Question was deleted", 200, question);
                        res.send(response);
                    }
                });
            }
        }
    });
});


examRouter.post('/question/:test_id/:index/:question_id/update', authentication, function (req, res) {
    Question.findByIdAndUpdate(req.params.question_id, req.body, function (err, question) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else {
            console.log("Test updated");
            Test.findById(req.params.test_id, function (err, test) {
                test.questions.splice(req.params.index, 1);
                var quest = new Question(req.body);
                test.questions.push(quest);
                test.save(function (err, result) {
                    if (err) {
                        error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
                        res.send(error);
                    } else {
                        response = responseGenerator.generate(false, "Question updated.", 200, result);
                        res.send(response);
                    }
                })
            })
        }
    });
});


examRouter.post('/tests/:test_id/questions/:question_id/answer', authentication, function (req, res) {
    var answerScore;
    var timetakenInsecs;
    Question.findById(req.params.question_id, function (err, question) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else {
            console.log("Question: " + question);
            console.log(req.body);
            var answer = new Answer(req.body);
            answer.user = decodedToken.id;
            answer.question = req.params.question_id;
            answer.test = req.params.test_id;
            console.log("User's answer: " + answer.userAnswer);
            console.log("Right answer: " + answer.correctAnswer);
        }
        answer.save(function (err, answer) {
            if (err) {
                error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
                res.send(error);
            } else {
                response = responseGenerator.generate(false, "Test done.", 200, answer);
                res.send(response);
            }
        });
    });
});


examRouter.get('/tests/:test_id/answer', authentication, function (req, res) {
    Answer.find({ "$and": [{ "user": req.decodedToken.id }, { "test": req.params.test_id }] }, function (err, answer) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "All answers recieved for this question", 200, answer);
            res.send(answer);
        }
    });
});


examRouter.get('/tests/:user_id/answers', authentication, function (req, res) {
    Answer.find(req.params.user_id, function (err, answers) {
        console.log(tests);
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else if (answers === [] || answers === undefined || answers === null) {
            error = responseGenerator.generate(true, "Nothing found", 204, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "All answers by this user recieved for this test.", 200, answers);
            res.send(response);
        }
    });
});


examRouter.post('/performance/:test_id', authentication, function (req, res) {
    var performanceScored = new Performance(req.body);
    performanceScored.user = decodedToken.id;
    performanceScored.test = req.params.test_id;
    performanceScored.save(function (err, performanceScored) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Performance stored.", 200, performanceScored);
            res.send(response);
        }
    });
});


examRouter.get('/performance/:test_id', authentication, function (req, res) {
    Performance.find(req.params.test_id, function (err, Performance) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else if (Performance === [] || Performance === undefined || Performance === null) {
            error = responseGenerator.generate(true, "Nothing found.", 204, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Performance for this test recieved.", 200, Performance);
            res.send(response);
        }
    });
});


examRouter.get('/performance/user/:user_id', authentication, function (req, res) {
    Performance.find({ user: req.params.user_id }, function (err, Performance) {
        if (err) {
            error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
            res.send(error);
        } else if (Performance === [] || Performance === undefined || Performance === null) {
            error = responseGenerator.generate(true, "Nothing found.", 204, null);
            res.send(error);
        } else {
            response = responseGenerator.generate(false, "Performance of this user in this test recieved.", 200, Performance);
            res.send(response);
        }
    });
});


examRouter.put('/tests/:testId/givenBy', authentication, function (req, res) {
    Test.findByIdAndUpdate({
        _id: req.params.testId
    },
        {
            $push:
                {
                    testgivenBy: req.body.testgivenBy
                }
        }, function (err, test) {

            if (err) {
                error = responseGenerator.generate(true, "There was a problem. Error: " + err, 500, null);
                res.send(error);
            } else {
                response = responseGenerator.generate(false, "Test given by user updated.", 200, test);
                res.send(response);
            }

        });
});

module.exports = examRouter;
