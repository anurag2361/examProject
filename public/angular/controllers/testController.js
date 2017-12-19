examApp.controller('testController', ['$filter', '$http', '$location', '$routeParams', 'queryService', 'authenticationService', function ($filter, $http, $location, $routeParams, queryService, authenticationService) {

    var main = this;
    var user;
    this.getsecurityQuestion = function () {
        var data = { _id: $routeParams.userId }

        queryService.getsecurityQuest(data)
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {

                    var userId;
                    var data = response.data.data;
                    main.user = data.name;
                    main.userId = data._id;
                    authenticationService.setToken(response.data.token);
                }
            }, function errorCallBack(response) {
                //console.log(response);
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
    main.heading = "Welcome to Exam App"

    this.getTests = function () {

        queryService.getTests()
            .then(function successCallBack(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    if (response.data.data.length == 0) {
                        alert("Sorry! No Test Is Assigned By Admin!!!");
                        $location.path('/dashboard/' + main.userId);
                    } else {
                        main.testArray = response.data.data;
                    }
                }
            }, function errorCallBack(response) {
                alert("There was a problem");

            })
    }


}]);
