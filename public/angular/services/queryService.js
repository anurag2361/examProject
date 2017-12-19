examApp.factory('queryService', function queryFactory($http, authenticationService, $q) {
    var queryArray = {};

    queryArray.log = '';
    queryArray.sign = '';

    queryArray.signUp = function (userData) {
        return $http.post('/users/signup', userData);
    }

    queryArray.login = function (loginData) {
        return $http.post('/users/login', loginData);
    }

    queryArray.facebookLogin = function () {
        return $http.get('/auth/facebook');
    }

    queryArray.googleLogin = function () {
        return $http.get('/auth/google');
    }

    queryArray.resetPassword = function (data) {
        return $http.post('/users/reset', data);
    }

    queryArray.getsecurityQuest = function (data) {
        return $http.post('/users/SecurityQuestion', data);
    }

    queryArray.setnewPassword = function (data) {
        return $http.post('/users/ResetPassword', data);
    }

    queryArray.createaTest = function (data) {
        return $http.post('/tests/createTest/admin?token=' + authenticationService.getToken(), data);
    }

    queryArray.getTests = function (data) {
        return $http.get('/tests/allTests?token=' + authenticationService.getToken(), data);
    }

    queryArray.createaQuestion = function (data) {
        return $http.post('/tests/' + data.id + '/createQuestion?token=' + authenticationService.getToken(), data);
    }

    queryArray.deleteaTest = function (data) {
        return $http.delete('/tests/test/delete/' + data + '?token=' + authenticationService.getToken(), data);
    }

    queryArray.viewQuestions = function (data) {
        return $http.get('/tests/' + data + '/getQuestions?token=' + authenticationService.getToken(), data);
    }

    queryArray.updateTests = function (data) {
        return $http.put('/tests/test/update/' + data.id + '?token=' + authenticationService.getToken(), data);
    }

    queryArray.deleteaQuestion = function (data, index, questId) {
        return $http.get('/tests/question/' + data.id + '/' + index + '/' + questId + '/delete?token=' + authenticationService.getToken());
    }

    queryArray.updateaQuestion = function (data, index, questId) {
        return $http.post('/tests/question/' + data.id + '/' + index + '/' + questId + '/update?token=' + authenticationService.getToken(), data);
    }

    queryArray.userInfo = function () {
        return $http.get('/users/getuserinfo?token=' + authenticationService.getToken());
    }

    queryArray.userinfoFacebook = function () {
        return $http.get('/getuserinfofacebook?token=' + authenticationService.getToken());
    }

    queryArray.userinfoGoogle = function () {
        return $http.get('/getuserinfogoogle?token=' + authenticationService.getToken());
    }

    queryArray.getasingleTest = function (singletestId) {
        return $http.get('/tests/test/' + singletestId + '?token=' + authenticationService.getToken());
    }

    queryArray.submitAnswer = function (data) {
        return $http.post('/tests/tests/' + data.testid + '/questions/' + data.questionid + '/answer?token=' + authenticationService.getToken(), data);
    }

    queryArray.submitTest = function (data) {
        return $http.post('/tests/performance/' + data.testid + '?token=' + authenticationService.getToken(), data);
    }

    queryArray.testgivenBy = function (testattemptData) {
        return $http.put('/tests/tests/' + testattemptData.testId + '/givenBy?token=' + authenticationService.getToken(), testattemptData);
    }

    queryArray.getusertestDetails = function (userId) {
        return $http.get('/tests/performance/user/' + userId + '?token=' + authenticationService.getToken());
    }

    return queryArray;
});
