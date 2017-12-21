examApp.controller('dashController', ['$filter', '$http', '$location', '$routeParams', 'queryService', 'authenticationService', function ($filter, $http, $location, $routeParams, queryService, authenticationService) {
    var main = this; //normal user dashboard
    var user;
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
        if (queryService.log === 1 || queryService.userId !== 'undefined') {
            return 1;
        } else {
            $location.path('/');
        }
    }
    this.logged();
    this.userId = $routeParams.userId;
    main.heading = "Welcome to Exam App";
    this.getusertestDetails = function () { //user test details are displayed on dashboard
        var userid = $routeParams.userId;
        queryService.getusertestDetails(userid)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var data = response.data.data;
                    main.testtakenInfo = data;
                    main.testtakenInfoforGraph = []; //for chart
                    main.testtakenInfoLabels = [];
                    var len = data.length;
                    for (var i = 0; i < data.length; i++) {
                        main.testtakenInfoforGraph.push(data[i].score); //push user score
                        main.testtakenInfoLabels.push(data[i]._id); //push user info
                    }
                    if (len === 0) { //if no test given
                        main.testtaken = "Give A Test first.";
                        main.avgMarks = "0";
                    } else {
                        var scoreCounter = 0;
                        for (var i = 0; i < len; i++) {
                            scoreCounter = scoreCounter + data[i].score; //calculate user score
                        }
                        main.avgMarks = (scoreCounter / len); //calculate average
                        main.testtaken = data.length; //no. of test taken
                    }
                }
            }, function errorCallback(response) {
                alert("There was a problem.");
            })
    }
    this.getusertestDetails();
    this.logout = function () {
        authenticationService.setToken();
        main.user = '';
        queryService.log = 0;
        queryService.userId = "undefined";
        queryService.userName = '';
        $location.path('/');
    }
}]);