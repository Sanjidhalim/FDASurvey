/**
 * Created by sanji on 4/11/2016.
 */

app.controller('users', ['$scope', '$http', function($scope, $http) {
    console.log("Loaded users controller");

    $http.get('/data/getSurveyList')
        .then(
            function(response){
                $scope.name = response.data.name;
                $scope.id = response.data.id;
                $scope.survey = response.data.survey;
            },
            function(){console.log("Failed to get data")});

}]);