/**
 * Created by sanji on 3/15/2016.
 */
var express = require('express');
var router = express.Router();
var participants = require('../models/participantModel');
var surveys = require('../models/surveyListModel');


router.get('/test',function (req,res){
    req.flash("hi","hello there");
    res.send("SSUp");
});


router.post('/getSurvey', function(req, res, next) {
    console.log("Logging id in get survey" + req.headers.id);
    authenticate(req.headers.email,req.headers.password, function(exists){
        if (exists){
            surveys.find({"_id":req.headers.id}, function (err,result){
                if (err) console.log(err);
                else {
                    var tmp = {};
                    tmp.questions = result[0].questions;
                    res.json(tmp);
                }
            })
        }
	else res.json({});
    });
});

router.post('/login',function(req,res,next){
    authenticate(req.headers.email,req.headers.password,function(exists){
        if(exists) {
	   findAllSurveys(req.headers.email, function(data){
		res.json({"survey":data,
                  "login":true});
	   });
	}
        else {
	console.log("FAILED LOGIN");
	res.json({"survey":[],
			"login":false});
}
    })
});

router.post('/saveSurvey', function (req, res,next){
    authenticate(req.headers.email, req.headers.password, function(exists){
        if (exists){
            console.log("Printing headers:" + JSON.stringify(req.headers));
            console.log("SurveyID" + req.headers.surveyid);
            /*surveys.find().where("_id").equals(req.headers.surveyID)
                .update({$set: {response:{"answers":req.headers.answer,"email":req.headers.email}}})
                .exec(function(err,data){
			if (err) {console.log("Error saving resposne to survey")}
			else {console.log("Responses saved to survey: " + JSON.stringify(data))}
		});*/
		var temp = {"answers":req.headers.answer,"email":req.headers.email};
		console.log("save survey temp var : " + JSON.stringify(temp));
		surveys.update({_id: req.headers.surveyid}, {
           		 $push: {
                		response: temp,
            			}
        		}, {}, function (err, numAffected) {
            				if (err) {console.log(err)}
            				else {console.log("Success save survey" + JSON.stringify(numAffected))};
        			});
            res.send(true);
        }
        else res.send (false);
    })
})

router.post('/addUser',function(req,res,next){
    participants.find({"email":"email"},function(err,data){
        if (err) console.log(err);
        else {
            if (data.length == 0){
		var participant = new participants({
		    "name":req.headers.name,
		    "password":req.headers.password,
		    "email":req.headers.email
		});
		participant.save( function (err, data){
            if (err) console.log ("Error:" + error) });
                res.send(true);
            }
            else res.send(false);
        }
    });

    }
);

function authenticate(email, pwd, cb){
    participants.find({"email":email},function(err,data){
        if (err) console.log(err);
        else {
            if (data.length == 0){
                cb(false)
            } else if (data[0].password != pwd)
                cb(false);
            else cb(true);
        }
    });
}


//Find all published surveys and send back survey name and surveyID
function findAllSurveys(email,cb){

    surveys.find().where('participants').in([email])
        .where('editable').equals('false')
        .where('response.email').nin([email])
        .select('name _id')
        .exec(function(err, results){
            cb(results);
        });
}

router.get('/test',function(req,res,next){

});

module.exports = router;
