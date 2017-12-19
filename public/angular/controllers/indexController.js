examApp.controller('indexController', ['$http', '$location', 'queryService', 'authenticationService', function ($http, $location, queryService, authenticationService) {
    var main = this;
    this.logged = function () {
        main.userID = queryService.userId;
        main.username = queryService.userName;

        if (queryService.log == 1 && queryService.userId !== 'undefined') {
            return 1;
        } else {
            return 0;
        }
    }

    this.logged();
    this.submitLogin = function () {
        var data = { email: main.email, password: main.password }
        queryService.login(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else if (response.data.data.name == 'Admin') {
                    var userId;
                    var data = response.data.data;
                    queryService.log = 1;
                    queryService.userId = data._id;
                    queryService.userName = response.data.data.name;
                    authenticationService.setToken(response.data.token);
                    $location.path('/admin/' + data._id);
                } else {
                    var userId;
                    var data = response.data.data;
                    queryService.log = 1;
                    queryService.userId = data._id;
                    queryService.userName = response.data.data.name;
                    authenticationService.setToken(response.data.token);
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallback(response) {
                alert('Some Error Occured.');
            });
    }

    this.submitSignup = function () {
        var data = { name: main.name, email: main.email, password: main.password, mobile: main.mobile, security: main.security, answer: main.answer }
        queryService.signUp(data)
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message)
                } else {
                    if (response.data.data.name == 'Admin') {
                        angular.element('#signupModal').modal('hide');
                        queryService.log = 1;
                        authenticationService.setToken(response.data.token);
                        var data = response.data.data;
                        queryService.userName = response.data.data.name;
                        $location.path('/admin/' + data._id);
                    } else {
                        angular.element('#signupModal').modal('hide');
                        queryService.log = 1;
                        authenticationService.setToken(response.data.token);
                        var data = response.data.data;
                        queryService.userName = response.data.data.name;
                        $location.path('/dashboard/' + data._id);
                    }
                }
            }, function errorCallback(response) {
                if (response.status === 400) {
                    alert(response.data);
                } else {
                    alert(response.data.message);
                }
            });
    }

    this.submitFacebook = function () {
        queryService.facebookLogin()
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data;
                    queryService.log = 1;
                    queryService.userId = data._id;
                    authenticationService.setToken(data.token);
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallback(response) {
                alert("Some Error Occured.");
            });
    }

    this.submitGoogle = function () {
        queryService.googleLogin()
            .then(function successCallback(response) {
                if (response.data.error === true) {
                    alert(response.data.message);
                } else {
                    var userId;
                    var data = response.data;
                    queryService.log = 1;
                    queryService.userId = data._id;
                    authenticationService.setToken(data.token);
                    $location.path('/dashboard/' + data._id);
                }
            }, function errorCallback(response) {
                alert("Some Error Occured.");
            });
    }
}]);