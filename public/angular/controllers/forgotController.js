examApp.controller('forgotController', ['$http', '$location', 'queryService', 'authenticationService', function ($http, $location, queryService, authenticationService) {
    var main = this; //forgot password button click controller
    this.submit = function () {
        var data = { email: main.email } //read email
        queryService.resetPassword(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data.data;
                    authenticationService.setToken(response.data.token); //set token to local storage
                    $location.path('/ResetPassword/' + data._id); //redirect to reset password page
                }
            }, function errorCallback(response) {
                alert("There was a problem");
            });
    }
}]);
