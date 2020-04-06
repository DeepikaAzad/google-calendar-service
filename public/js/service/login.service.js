// app.service('$todoService', function($http) {
    app.factory('HomeService', function ($http, $window) {

        const baseUrl =  $window.origin;
    
        return {
            googleLogin: function () {
                return $http.get(baseUrl + '/login');
            }
        };
    });