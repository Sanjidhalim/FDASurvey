/**
 * Created by sanji on 3/15/2016.
 */
var express = require('express');
var router = express.Router();
var participants = require('../models/participantModel');
var surveys = require('../models/surveyListModel');


router.post('/getSurvey', function(req, res, next) {
    console.log(req.headers.id);
    authenticate(req.headers.email,req.headers.password, function(exists){
        if (exists){
            surveys.find({"_id":req.headers.id}, function (err,result){
                if (err) console.log(err);
                else {
                    var tmp = {};
                    tmp.questions = result.questions;
                    res.json(tmp);
                }
            })
        }
    });
    res.json({});
});

//Authenticates login and sends json array of surveynames and surveyID.
router.post('/login',function(req,res,next){
    console.log("email:" + req.headers.email);
    authenticate(req.headers.email,req.headers.password,function(exists){
        if(exists) {
            findAllSurveys(req.headers.email, function(data){
                res.json({"survey": data});
            });
        }
        else res.json({"survey":[]});
    })
});

//Adds new participant to database. Prevents signup if email exists in db.
router.post('/addUser',function(req,res,next){
    participants.find({"email":req.headers.email},function(err,data){
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

// Authenticates participant login
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
        .where('response.email').nin(["B@test.com"])
        .select('name _id')
        .exec(function(err, results){
            cb(results);
        });
}

router.get('/test',function(req,res,next){

});

module.exports = router;
