/**
 * Created by sanji on 3/15/2016.
 */
var express = require('express');
var router = express.Router();
var participants = require('../models/participantModel');
var surveys = require('../models/surveyListModel');


router.get('/getSurvey', function(req, res, next) {
   var x =  {"questions" : [
      { "options" : [ ] , "prompt" : "This is a text question" , "type" : "Txt"} ,
  //    { "options" : [ ] , "prompt" : "This is a numeric question" , "type" : "Num"} ,
      { "options" : [ "Choice 1" , "Choice 2" , "Choice 3"] , "prompt" : "This is a multiple choice question" , "type" : "Mc"}]
  }
    console.log(req.headers.email);
    res.json(x);
});

router.post('/getAllSurveys', function(req,res,next){
    authenticate(req.headers.email, req.headers.password,
        function(exists){
            if (!exists) res.send("Invalid username/pwd");
            else {
                var x =  { "name":"Mock Survey",
                    "questions" : [
                    { "options" : [ ] , "prompt" : "This is a text question" , "type" : "Txt"} ,
                    { "options" : [ ] , "prompt" : "This is a numeric question" , "type" : "Num"} ,
                    { "options" : [ "Choice 1" , "Choice 2" , "Choice 3"] , "prompt" : "This is a multiple choice question" , "type" : "Mc"}]
            }
                res.json(x);
            }
        })
});
router.get('/test',function(){
    findSurveys("A@test.com",null);
})

function findSurveys(email,cb){
    surveys.find({"participants": {"$elemMatch":"A@test.com"}}, function (err, result){
        console.log("Inside findSurvey");
        console.log(result[0]);
        res.end("Working on it");
    })
/*    surveys.find().elemMatch('participants','A@test.com').exec(function(err, results){
        console.log("Inside findSurvey");
        console.log(results);
    })*/
}

function authenticate(email, pwd, cb){
    participants.find({"email":"email"},function(err,model){
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

module.exports = router;
