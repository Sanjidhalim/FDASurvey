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

    //Replaces white spaces with + for url
    $scope.splitAndAdd = function(str){
        return str.split(' ').join('+');
    }

}]);

app.controller('homePage', ['$scope', function($scope) {
    console.log("Loaded home controller");
}]);

app.controller('participant', ['$scope','$http','$routeParams', function($scope, $http, $routeParams) {
    $http.get('/data/getParticipants?id='+$routeParams.id)
        .then(
            function(response){
                $scope.participants = response.data.participants;
            },
            function(){console.log("Failed to get data")});

    $scope.id = $routeParams.id;
    $scope.name = $routeParams.nm;

    $scope.submit = function(email){
        $http.post('/data/addParticipants?id='+$scope.id,
            {'email': email })
            .then(
                function(response){
                    $scope.participants = response.data.participants;
                    console.log("Updated Participant" + response.data);
                },
                function(){console.log("fail sending data to server")});

    };
}]);