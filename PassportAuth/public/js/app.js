/**
 * Created by sanji on 4/11/2016.
 */
var app = angular.module('myApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider
                .when("/", {
                    templateUrl: "partials/home.ejs",
                    controller: "homePage"
                })
                .when("/users", {
                    templateUrl: "partials/users.ejs",
                    controller: "users",
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .when("/renderSurvey", {
                    templateUrl: "partials/renderSurvey.ejs",
                    controller: "renderSurvey",
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .when("/participant", {
                    templateUrl: "partials/participants.ejs",
                    controller: "participant",
                    resolve: {
                        loggedin: checkLoggedin
                    }
                })
                .otherwise({ redirectTo: "/signup" });

        }
    ]
);


//Checking LoggedIn with promises
var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
            deferred.resolve();

        // Not Authenticated
        else {
            $rootScope.message = 'You need to log in.';
            deferred.reject();
            $location.url('/');
        }
    });

    return deferred.promise;
};