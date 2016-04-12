/**
 * Created by sanji on 4/11/2016.
 */
app.controller('renderSurvey', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    //for adding multiple choice and checkbox options
    $scope.newOptions = [];
    $scope.mcqPrompts=[];

    //ng-model values for adding new questions
    $scope.questionType = "";
    $scope.newQuestion = "";

    //Gets Data and Populates Survey
    populate = function(id) {
        $http.get('/data/getSurvey?id='+id)
            .then(
                function(response){
                     $scope.questions = response.data.questions;
                     $scope.notEnabled = !response.data.editable;
                     $scope.surveyName =response.data.name;
                     $scope.id = response.data.id;
                },
                function(){console.log("Failed to get data")});
    };

    if ($routeParams.new == 'yes'){
        $scope.questions = [];
        $scope.notEnabled = false;
        $scope.surveyName ="";
        $scope.id = null;
    }
    else{
        populate($routeParams.id);
    }


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

    //saves Survey and updates id if new Survey.
    $scope.saveSurvey = function(){
        $http.post('/data/saveSurvey',
            {'questions': $scope.questions,
                'editable': !$scope.notEnabled,
                'name' : $scope.surveyName,
                'id' :$scope.id
            })
            .then(
                function(response){
                    $scope.id = response.data.id;
                    console.log("Updated Scope id" + $scope.id);
                },
                function(){console.log("fail sending data to server")});
        //alert("You are about to save "+ surveyName );
    };

    $scope.publish = function(){
        $scope.notEnabled=true;
        $scope.saveSurvey();
    };

}]);