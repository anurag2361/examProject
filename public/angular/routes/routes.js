examApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/index.html',
            controller: 'indexController',
            controllerAs: 'index'
        })
        .when('/loginsignup', {
            templateUrl: 'views/loginsignup.html',
            controller: 'indexController',
            controllerAs: 'index'
        })
        .when('/dashboard/:userId', {
            templateUrl: 'views/dashboard.html',
            controller: 'dashController',
            controllerAs: 'dashboard'
        })
        .when('/forgotpassword', {
            templateUrl: 'views/forgotpassword.html',
            controller: 'forgotController',
            controllerAs: 'forgot'
        })
        .when('/ResetPassword/:userId', {
            templateUrl: 'views/resetpassword.html',
            controller: 'resetController',
            controllerAs: 'reset'
        })
        .when('/taketheTest/:userId', {
            templateUrl: 'views/taketheTest.html',
            controller: 'testController',
            controllerAs: 'test'
        })
        .when('/liveTest/:userId/:testId', {
            templateUrl: 'views/liveTest.html',
            controller: 'liveController',
            controllerAs: 'live'
        })
        .when('/admin/:userId', {
            templateUrl: 'views/admin.html',
            controller: 'adminController',
            controllerAs: 'admin'
        })
        .otherwise({
            template: '<p></br><h2 align="center" class="well" style="margin: 10%;">404, page not found</br></h2></p>\
		<p align="center"><button align="center"><a href="#/" style="color:black">Homepage</a></button></p>'
        });
}]);
