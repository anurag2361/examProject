examApp.factory('authenticationService', ['$window', function ($window) { //factory to manage token
    var authToken = {};
    var store = $window.localStorage; //accessing local storage 
    var key = 'auth-token';
    authToken.getToken = function () { //function to retrieve token
        return store.getItem(key);
    }

    authToken.setToken = function (token) { //function to set a token to local storage
        if (token) {
            store.setItem(key, token);
        } else {
            store.removeItem(key);
        }
    }

    return authToken;
}]);
