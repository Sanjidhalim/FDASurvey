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
    $http.post('/data/getParticipants?id='+$routeParams.id,null)
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
                    if (response.data.participants.length!=0){
                        $scope.participants = response.data.participants;
                        $scope.email="";
                    }
                },
                function(){console.log("fail sending data to server")});

    };

    $scope.deleteParticipant = function(person){
        $http.post('/data/deleteParticipant?id='+$scope.id+"&person="+person,null)
            .then(
                function(response){
                    if(response.data.dbQuery.success==true){
                        $scope.participants = response.data.dbQuery.participants;
                    }
                },
                function(){console.log("Failed to get data")});
    }
}]);

app.controller('result', ['$scope','$http','$routeParams', function($scope, $http, $routeParams) {
    $scope.id = $routeParams.id;
    //$scope.name = $routeParams.nm;
	
	var getAnswers = function(response){
		var answerArray = [];
		//converts response string to array where each index contains another array
		//with all answers of a particular individual

		for (var i=0;i<response.length;i++){
			answerArray.push(response[i].answers.slice(1,-1).split(","));
		}
		//convers previous array to array where each index contains an array
		//containing all answers for particular question
		var modAnsArray = [];
		for (var i=0;i<answerArray[0].length;i++){
			var temp=[];
				for(var j=0;j<response.length;j++){
					temp.push(answerArray[j][i]);
				}
				modAnsArray.push(temp);
		}
		console.log(modAnsArray);
		return modAnsArray;		
	};
	
	var getQuestions =  function(data){
		var temp=[];
		for (var i=0; i<data.length;i++){
			temp.push(data[i].prompt);
		}
		console.log("Questions: " + temp);
		return temp;
	};

    $http.post('/data/getResults?id='+$routeParams.id,null)
        .then(
            function(response){
				if(response.data.dbQuery.hasOwnProperty('response') &&
						response.data.dbQuery.response.length!=0){
					$scope.hasResponses = true;
					$scope.answers = getAnswers(response.data.dbQuery.response);
					$scope.questions = getQuestions(response.data.dbQuery.questions);
					$scope.name = response.data.dbQuery.name;
				
				} else {$scope.hasResponses = false}
				console.log("HAS RESPONSE: " + $scope.hasResponses);
			},
            function(){console.log("Failed to get data")});
}]);