/**
 * Created by sanji on 4/11/2016.
 */
app.controller('homePage', ['$scope', function($scope) {
    $scope.tada=56;
    console.log("Loaded home controller");
}]);

app.controller('users', ['$scope', function($scope) {
    $scope.tada=56;
    console.log("Loaded users controller");
}]);