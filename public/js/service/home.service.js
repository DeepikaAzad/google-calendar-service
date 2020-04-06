// app.service('$todoService', function($http) {
    app.factory('HomeService', function ($http,$window) {
        const baseUrl =  $window.origin;
    
        return {
            fetchCalendarEvents: function() {
                return $http.get(baseUrl + '/calendar/events')
            }
        };
    });