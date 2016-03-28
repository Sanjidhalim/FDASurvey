var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");
    $scope.params=null;

    populate = function() {
        $http.get('/renderSurvey/getSurvey')
            .then(
                function(response){
                    console.log("Success getting data. Questions are:" );
                    console.log(response.data.questions[3]);
                    $scope.questions = response.data.questions;
                    $scope.notEnabled = !response.data.editable;
                    $scope.surveyName =response.data.name;
                    $scope.id = response.data.id;
                },
                function(){console.log("Failed to get data")});
    }
    ;
    populate();

    //DEBUGGING********////
/*    var questions = [{type:"Num",prompt: "Tada",option:[]},
        {type:"Mc",prompt:"Tada2",options:["Yolo2","Swag2"]}
    ];
    $scope.questions = questions;*/

    //for adding multiple choice and checkbox options
    $scope.newOptions = [];
    $scope.mcqPrompts=[];

    //ng-model values for adding new quesitons
    $scope.questionType = "";
    $scope.newQuestion = "";

    $scope.newMcOption= function(){
        $scope.newOptions.push($scope.newOptions.length);
        console.log("MCQ PROMPTS:" + $scope.mcqPrompts);
        console.log($scope.questionType);
        console.log($scope.newQuestion);
    };

    //Add Questions of question is not empty
    $scope.addQuestion = function() {
        if($scope.questionType!="" && $scope.newQuestion != ""){
        $scope.questions.push({type:$scope.questionType,
            prompt: $scope.newQuestion,
            options: $scope.mcqPrompts});
        console.log($scope.questions);


        //reset Add Question values;
        $scope.newOptions = [];
        $scope.mcqPrompts=[];
        $scope.questionType = "";
        $scope.newQuestion = "";
        }

    };

    //saves and redirects to home page.
    $scope.saveSurvey = function(){
        $http.post('/renderSurvey/saveSurvey',
            {'questions': $scope.questions,
                'editable': !$scope.notEnabled,
                'name' : $scope.surveyName,
                'id' :$scope.id
            })
            .then(
                function(response){
                    console.log("Success sending data to server")
                },
                function(){console.log("fail sending data to server")});
        //alert("You are about to save "+ surveyName );
    }

    $scope.publish = function(){
        $scope.notEnabled=true;
        $scope.saveSurvey();
    }


}]);
