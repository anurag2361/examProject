examApp.controller('adminController', ['$filter', '$http', '$location', '$routeParams', 'queryService', 'authenticationService', function ($filter, $http, $location, $routeParams, queryService, authenticationService) {
    var main = this;
    var user;
    this.getsecurityQuestion = function () {
        var data = {
            _id: $routeParams.userId
        }
        queryService.getsecurityQuest(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data.data;
                    main.user = data.name;
                    authenticationService.setToken(response.data.token);
                }
            }, function errorCallback(response) {
                alert("There was a problem in token.");
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
    main.heading = "Admin";
    this.Create = function () {
        var data = {
            testName: main.testName,
            testCategory: main.testCategory,
            testDetails: main.testDetails,
            totalScore: main.totalScore,
            testDuration: main.testDuration
        }
        queryService.createaTest(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    console.log(response);
                    $('.form-control').val('');
                    $('#myModal').modal('hide');
                    main.getTests();
                    alert('Test Created.');
                }
            }, function errorCallBack(response) {
                alert("There was a problem in creation..");
            })
    }
    var testId;
    this.getTests = function () {
        queryService.getTests()
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.testArray = response.data.data;
                }
            }, function errorCallback(response) {
                alert("There was a problem in getting tests.");
            })
    }

    this.createaQuestion = function () {
        var data = {
            question: main.question,
            optionA: main.optionA,
            optionB: main.optionB,
            optionC: main.optionC,
            optionD: main.optionD,
            answer: main.answer,
            id: main.idtest
        }
        queryService.createaQuestion(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    $('.form-control').val('');
                    $('#myModal3').modal('hide');
                    main.getTests();
                    alert("Question created.");
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.deleteaTest = function (id) {
        var data = id;
        queryService.deleteaTest(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.getTests();
                    alert("Test was deleted.");
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.viewQuestions = function (id) {
        var data = id;
        queryService.viewQuestions(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.questArray = response.data.data;
                    if (main.questArray.length == 0) {
                        alert("No questions available.");
                    } else {
                        $('#myModalViewQues').modal('show');
                        alert("All Questions recieved.");
                    }
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.viewandUpdateQuestion = function (id) {
        var data = id;
        queryService.viewQuestions(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.questArray = response.data.data;
                    if (main.questArray.length == 0) {
                        alert("No questions available.");
                    } else {
                        $('#myModalQuestionList').modal('show');
                        alert("All questions recieved.");
                    }
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.viewandUpdateDesiredQuestion = function (id) {
        main.useridtoUpdateTest = id;
        var data = id;
        queryService.viewQuestions(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.questArray = response.data.data;
                    if (main.questArray.length == 0) {
                        alert("There was a problem.");
                    } else {
                        $('#myModalQuestionListtoupdate').modal('show');
                        alert("All Questions recieved.");
                    }
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.updateForm = function (index, questionid) {
        main.updatequestionindex = index;
        main.idofquestiontoupdat = questionid;
        $('#myModalQuestionListtoupdateform').modal('show');
    }

    this.deleteaQuestion = function (index, questid) {
        var data = { id: main.idtest }
        queryService.deleteaQuestion(data, index, questid)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    $('#myModalQuestionList').modal('hide');
                    main.getTests();
                    alert("Question at index " + (index + 1) + " was deleted.");
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.updateaQuestion = function () {
        var data = {
            question: main.question,
            optionA: main.optionA,
            optionB: main.optionB,
            optionC: main.optionC,
            optionD: main.optionD,
            answer: main.answer,
            id: main.useridtoUpdateTest
        }
        queryService.updateaQuestion(data, main.updatequestionindex, main.idofquestiontoupdat)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    alert("Question was updated.");
                    $('.form-control').val('');
                    $('#myModalQuestionListtoupdateform').modal('hide');
                    $('#myModalQuestionListtoupdate').modal('hide');
                    main.getTests();
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.updateTests = function () {
        var data = {
            testName: main.testName,
            testCategory: main.testCategory,
            testDetails: main.testDetails,
            totalScore: main.totalScore,
            testDuration: main.testDuration,
            id: main.updateid
        }
        queryService.updateTests(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    $('.form-control').val('');
                    $('#myModalUpdateTest').modal('hide');
                    main.getTests();
                    alert("Test was updated.");
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.getuserInfo = function () {
        queryService.userInfo()
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userInfo = response.data.data;
                    $('#myModalgetUserinfo').modal('show');
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.getuserinfoFacebook = function () {
        queryService.userinfoFacebook()
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userinfoFacebook = response.data;
                    $('#myModalgetUserinfofacebook').modal('show');
                }
            }, function errorCallBack(response) {
                alert("There was a problem");
            })
    }

    this.getuserinfoGoogle = function () {
        queryService.userinfoGoogle()
            .then(function successCallBack(response) {

                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userinfoGoogle = response.data;
                    $('#myModalgetUserinfogoogle').modal('show');
                }
            }, function errorCallBack(response) {
                alert("There was a problem.");
            })
    }

    this.infoforPerformance = function () {
        queryService.userInfo()
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userInfoforperformance = response.data.data;
                    $('#myModalgetUserinfoforperformance').modal('show');
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.getperformanceInfo = function (userId) {
        var id = userId;
        queryService.getusertestDetails(id)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    main.userinfoforPerformance = response.data.data;
                    $('#myModalgetUserinfoforperformanceshow').modal('show');
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }

    this.logout = function () {
        authenticationService.setToken();
        main.user = '';
        queryService.log = 0;
        queryService.userId = "undefined";
        queryService.userName = '';
        $location.path('/');
    }
}])
