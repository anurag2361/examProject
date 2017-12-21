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

                    var userId; //when user passes checks, retrieve his id
                    var data = response.data.data;
                    main.user = data.name; //retrieve name
                    main.userId = data._id; //retrieve id
                    authenticationService.setToken(response.data.token);//set recieved token to local storage
                }
            }, function errorCallBack(response) {
                //console.log(response);
                alert("There was a problem.");

            })
    }

    this.getsecurityQuestion();

    this.logged = function () { //check if logged in
        main.username = queryService.userName; //retrieve username
        if (queryService.log === 1 || queryService.userId !== 'undefined') { //strict checking
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
                        $location.path('/dashboard/' + main.userId); //redirect to homepage if no test present
                    } else {
                        main.testArray = response.data.data;//retrieve tests
                    }
                }
            }, function errorCallBack(response) {
                alert("There was a problem");

            })
    }


}]);
