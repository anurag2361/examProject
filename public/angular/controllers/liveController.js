examApp.controller('liveController', ['$scope', '$filter', '$http', '$location', '$routeParams', 'queryService', 'authenticationService', function ($scope, $filter, $http, $location, $routeParams, queryService, authenticationService) {
    var main = this;
    var totalnoofQuestions;
    var user;
    main.questionsforTime = [];
    this.getsecurityQuestion = function () {
        var data = { _id: $routeParams.userId }
        queryService.getsecurityQuest(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data.data;
                    main.user = data.name;
                    main.userId = data._id;
                    authenticationService.setToken(response.data.token);
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.getsecurityQuestion();
    this.logged = function () {
        main.username = queryService.userName;
        if (queryService.log == 1 || queryService.userId !== 'undefined') {
            return 1;
        } else {
            $location.path('/');
        }
    }
    this.logged();
    this.userId = $routeParams.userId;
    main.heading = "Welcome To Exam App";
    $('.thisismodalforlivetestwarning').modal('show');
    $(document).on('click', '#returntotaketest', function () {
        $('.thisismodalforlivetestwarning').modal('hide');
        location.replace("#/taketheTest/" + main.userId);
    })

    this.getasingleTest = function () {
        var singletestId = $routeParams.testId;
        queryService.getasingleTest(singletestId)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                    window.location.href = "#/taketheTest/" + main.userId;
                } else {
                    if (response.data.data.questions.length == 0) {
                        $location.path("/taketheTest/" + main.userId);
                        alert("No questions present.");
                    } else {
                        main.totalnoofQuestions = response.data.data.questions.length;
                        main.questionsforTime.push(response.data.data.questions.length);
                        main.testHeading = "Test topic is " + response.data.data.testName;
                        main.singletestArray = response.data.data.questions;
                        main.time = response.data.data.testDuration;
                    }
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }
    this.getasingleTest();
    var totalSeconds = 300;
    var minutes = parseInt(totalSeconds / 60);
    var seconds = parseInt(totalSeconds % 60);
    this.theTime = function () {
        totalSeconds = totalSeconds - 1;
        minutes = parseInt(totalSeconds / 60);
        seconds = parseInt(totalSeconds % 60);
        main.timetakeninTest = (300 - totalSeconds);
        document.getElementById('test-time-left').innerHTML = 'Time Left: ' + minutes + ' minutes ' + seconds + ' seconds';
        if (totalSeconds <= 0) {
            clearTimeout(main.counttime);
            main.timetakeninTest = 300;
            alert("Time Is Up!!");
            container.style.display = 'none';
            var testattemptData = {
                testgivenBy: main.user,
                testId: $routeParams.testId
            }
            queryService.testgivenBy(testattemptData)
                .then(function successCallback(response) { }, function errorCallback(response) { })

            var data = {
                userid: $routeParams.userId,
                testid: $routeParams.testId,
                score: score,
                timeTaken: main.timetakeninTest,
                totalCorrect: (score / 10),
                totalIncorrect: (10 - (score / 10))
            }
            queryService.submitTest(data)
                .then(function successCallback(response) {
                    if (response.data.error === true) {
                        alert(response.data.message);
                    } else {
                        main.performanceUserID = response.data.data.user;
                        main.answerscorrect = response.data.data.totalCorrect;
                        main.answerswrong = response.data.data.totalIncorrect;
                        main.madeScore = response.data.data.score;
                        main.timeTaken = response.data.data.timeTaken;
                        $('.thisismodalforUserTestPerformance').modal('show');
                    }
                }, function errorCallback(response) {
                    alert("There was a problem.");
                })
        }
    }

    var currentQuestion = 0;
    var score = 0;
    var totalQuestionAsked = 0;
    var container = document.getElementById('testContainer');
    var questionEl = document.getElementById('question');
    var opt1 = document.getElementById('opt1');
    var opt2 = document.getElementById('opt2');
    var opt3 = document.getElementById('opt3');
    var opt4 = document.getElementById('opt4');
    var nextButton = document.getElementById('nextButton');
    var resultCont = document.getElementById('result');
    this.loadQuestion = function (questionIndex) {
        if (questionIndex == 0) {
            totalQuestionAsked = main.totalnoofQuestions;
            $('.thisismodalforlivetestwarning').modal('hide');
            main.counttime = setInterval(this.theTime, 1000);
        }
        var q = main.singletestArray[questionIndex];
        questionEl.textContent = (questionIndex + 1) + '.' + q.question;
        opt1.textContent = q.optionA;
        opt2.textContent = q.optionB;
        opt3.textContent = q.optionC;
        opt4.textContent = q.optionD;
    };
    this.nextQuestion = function () {
        var selectedOption = document.querySelector('input[type=radio]:checked');
        if (!selectedOption) {
            alert("Select An Answer First.");
            return;
        }
        var selectValue = selectedOption.value;
        var answerValue = document.getElementById('opt' + selectValue);
        var answer = answerValue.textContent;
        if (main.singletestArray[currentQuestion].answer == answer) {
            score += 10;
        }
        var data = {
            userid: $routeParams.userId,
            testid: $routeParams.testId,
            questionid: main.singletestArray[currentQuestion]._id,
            userAnswer: answer,
            correctAnswer: main.singletestArray[currentQuestion].answer,
            timetakenInsecs: main.timetakeninTest
        }
        queryService.submitAnswer(data)
            .then(function successCallback(response) { }, function errorCallback(response) { })
        selectedOption.checked = false;
        currentQuestion++;
        if (currentQuestion == totalQuestionAsked - 1) {
            nextButton.textContent = 'Finish';
        }
        if (currentQuestion == totalQuestionAsked) {
            container.style.display = 'none';
            clearTimeout(main.counttime);
            var testattemptData = {
                testgivenBy: main.user,
                testId: $routeParams.testId
            }
            queryService.testgivenBy(testattemptData)
                .then(function successCallback(response) { }, function errorCallback(response) { })

            var data = {
                userid: $routeParams.userId,
                testid: $routeParams.testId,
                score: score,
                timeTaken: main.timetakeninTest,
                totalCorrect: (score / 10),
                totalIncorrect: (10 - (score / 10))
            }
            queryService.submitTest(data)
                .then(function successCallback(response) {
                    if (response.data.error === true) {
                        alert(response.data.message);
                    } else {
                        main.performanceUserID = response.data.data.user;
                        main.answerscorrect = response.data.data.totalCorrect;
                        main.answerswrong = response.data.data.totalIncorrect;
                        main.madeScore = response.data.data.score;
                        main.timeTaken = response.data.data.timeTaken;
                        $('.thisismodalforUserTestPerformance').modal('show');
                    }
                }, function errorCallback(response) {
                    alert("There was a problem");
                })
            return;
        }
        this.loadQuestion(currentQuestion);
    }



}]);
