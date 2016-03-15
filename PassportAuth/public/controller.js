var myApp = angular.module('myApp', []);/*.
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/renderSurvey/:nm', {
        templateUrl: '/Survey',
        controller: 'AppCtrl'
    }).
    otherwise({
        redirectTo: '/users'
    });
    $locationProvider.html5Mode(true);
}]);
*/

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");
    $scope.params=null;
/*    $scope.init = function(parameter){
        $scope.params = parameter;
        console.log("Parameter = " + parameter);
        console.log("Trying to get params: " + $scope.params);
    };*/

    populate = function() {
        $http.get('/renderSurvey/formData')
            .then(
                function(response){
                    console.log("Success getting data");
                    $scope.questions = response.data.questions;
                    $scope.notEnabled = !response.data.editable;
                    $scope.surveyName =response.data.name;
                    $scope.id = response.data.id;
                },
                function(){console.log("Failed to get data")});
    }
    ;
    populate();

    $scope.addQuestion = function(newQuestion) {
        var newItemNo = $scope.questions.length+1;
        $scope.questions.push({prompt: newQuestion});
        console.log($scope.questions);
    };

    $scope.saveSurvey = function(){
        $http.post('/renderSurvey/saveSurvey',
            {'questions': $scope.questions,
                'editable': !$scope.notEnabled,
                'name' : $scope.surveyName,
                'id' :$scope.id
            })
            .then(
                function(){
                    publish();
                    console.log("Success sending data to server")
                },
                function(){console.log("fail sending data to server")});
        //alert("You are about to save "+ surveyName );
    }


}]);