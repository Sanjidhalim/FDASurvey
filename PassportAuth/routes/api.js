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
router.get('/test',function(req,res){
    findSurveys("A@test.com",res);
});

//Find all published surveys and send back survey name, questions, and surveyID
function findSurveys(email,cb){

    surveys.find().where('participants').in(["B@test.com"]).exec(function(err, results){
        console.log(results);
        var publishedSurveys=[];
        for (var i=0;i<results.length;i++){
            if(!results[i].editable){
                var tmp={};
                tmp.name = results[i].name;
                tmp.id=results[i]._id;
                tmp.questions= results[i].questions;
                publishedSurveys.push(tmp);
            }
        }
        cb.send(publishedSurveys);
    })
}

router.post('/login',function(req,res,next){
    console.log("email:" + req.headers.email);
    authenticate(req.headers.email,req.headers.password,function(exists){
        if(exists) res.send(true);
        else res.send(false);
    })
});

router.post('/addUser',function(req,res,next){
    participants.find({"email":"email"},function(err,model){
        if (err) console.log(err);
        else {
            if (data.length == 0){
                participants.insert({"email":req.headers.email,
                    "name":req.headers.name,
                    "password":req.headers.password});
                res.send("Account created");
            }
            else res.send("Account already exists");
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

module.exports = router;
