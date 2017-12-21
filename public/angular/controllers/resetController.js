examApp.controller('resetController', ['$http', '$location', '$routeParams', 'queryService', 'authenticationService', function ($http, $location, $routeParams, queryService, authenticationService) {
    var main = this;
    this.getsecurityQuestion = function () {
        var data = { _id: $routeParams.userId } //retrieve user id
        queryService.getsecurityQuest(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data.data;
                    main.security = data.security; //security question
                    authenticationService.setToken(response.data.token);//set token to local storage
                }
            }, function errorCallback(response) {
                alert("There was a problem in reset security");
            })
    }

    this.getsecurityQuestion();
    this.submit = function () {
        var data = {
            answer: main.answer, //security answer
            _id: $routeParams.userId,//pass user id
            password: main.password//pass password
        }
        queryService.setnewPassword(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    alert("Password changed.");
                    $location.path('/');//redirect
                }
            }, function errorCallback(response) {
                alert("There was a problem in changing password");
            });
    }
}]);
