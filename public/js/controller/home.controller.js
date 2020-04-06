app.controller('homeController', function ($scope, $route, $rootScope, HomeService, toastr) {
    $scope.today = new Date();

    // Called on page init.
    $scope.initPage = function () {
        $scope.currentUser = $rootScope.currentUser;

        $scope.calendarView = "month";
        $scope.viewDate = new Date();
        $scope.calendarEvents = [];
        $scope.calendarTitle = "Postman Personal Calendar";

        $scope.fetchCalendarEvents();
    }

    $scope.fetchCalendarEvents = function () {
        HomeService.fetchCalendarEvents().then(function successCallback(response) {
            for (let i = 0; i < response.data.length; i++) {
                const event = {
                    title: response.data[i].summary,
                    startsAt: new Date(response.data[i].start.dateTime),
                    endsAt: new Date(response.data[i].end.dateTime),
                    color: {
                        primary: '#e3bc08',
                        secondary: '#fdf1ba'
                    },
                    actions: [{
                        label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                        cssClass: 'edit-action',
                        onClick: $scope.editEvent
                    }],
                    draggable: true,
                    resizable: true,
                    incrementsBadgeTotal: true,
                    recursOn: 'year',
                    cssClass: 'a-css-class-name',
                    allDay: false
                };
                $scope.calendarEvents.push(event);
            }
        }, function errorCallback(error) {
            // @TODO: Handle the error properly instead of alert.
            toastr.error('Error@Fetching the calendar events', 'Error !!');
        });
    }

    $scope.eventClicked = function(calendarEvent) {
        // Handle event clicked.
    }

    $scope.editEvent = function(calendarEvent) {
        // Handle event edit.
    }

    $scope.initPage();
});