var app = angular.module("CalendarApp", ["ngRoute", "ngAnimate", "toastr", "mwl.calendar", "ui.bootstrap"]);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'loginController'
		})
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'homeController',
			resolve: {
				checkLoggedin: checkLoggedin
			}
		})
		.otherwise({
			redirectTo: '/login'
		})
});

const checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
	var deferred = $q.defer();

	$http.get('/auth/loggedin').success(function (user) {
		//User is Authenticated
		$rootScope.currentUser = user.data;
		deferred.resolve();
	}).error(function (error) {
		//User is not Authenticated
		$rootScope.errorMessage = 'You need to log in.';
		deferred.reject();
		$location.url('/#/login');
	});
	return deferred.promise;
};