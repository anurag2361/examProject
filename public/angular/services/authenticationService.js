examApp.factory('authenticationService', ['$window', function ($window) {
    var authToken = {};
    var store = $window.localStorage;
    var key = 'auth-token';
    authToken.getToken = function () {
        return store.getItem(key);
    }

    authToken.setToken = function (token) {
        if (token) {
            store.setItem(key, token);
        } else {
            store.removeItem(key);
        }
    }

    return authToken;
}]);
