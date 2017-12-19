examApp.controller('resetController', ['$http', '$location', '$routeParams', 'queryService', 'authenticationService', function ($http, $location, $routeParams, queryService, authenticationService) {
    var main = this;
    this.getsecurityQuestion = function () {
        var data = { _id: $routeParams.userId }
        queryService.getsecurityQuest(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data.data;
                    main.security = data.security;
                    authenticationService.setToken(response.data.token);
                }
            }, function errorCallback(response) {
                alert("There was a problem in reset security");
            })
    }

    this.getsecurityQuestion();
    this.submit = function () {
        var data = {
            answer: main.answer,
            _id: $routeParams.userId,
            password: main.password
        }
        queryService.setnewPassword(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    alert("Password changed.");
                    $location.path('/');
                }
            }, function errorCallback(response) {
                alert("There was a problem in changing password");
            });
    }
}]);
