app.controller('loginController', function ($scope, $route, toastr, HomeService) {
	$scope.today = new Date();

	// Called on page init.
	$scope.initPage = function() {
    }
    
    $scope.login = function() {
        HomeService.googleLogin().then(function successCallback(response) {
            // ?
        }, function errorCallback(response) {
            // @TODO: Handle the error properly instead of alert.
            toastr.error('Error@Storing the task in DB', 'Error !!');
        });
    }

	$scope.initPage();
});