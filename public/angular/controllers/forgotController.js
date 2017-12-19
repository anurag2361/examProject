examApp.controller('forgotController', ['$http', '$location', 'queryService', 'authenticationService', function ($http, $location, queryService, authenticationService) {
    var main = this;
    this.submit = function () {
        var data = { email: main.email }
        queryService.resetPassword(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data.data;
                    authenticationService.setToken(response.data.token);
                    $location.path('/ResetPassword/' + data._id);
                }
            }, function errorCallback(response) {
                alert("There was a problem");
            });
    }
}]);
