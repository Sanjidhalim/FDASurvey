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
                .otherwise({ redirectTo: "/signup" });

        }
    ]
);
