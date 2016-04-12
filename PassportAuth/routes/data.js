/**
 * Created by sanji on 4/11/2016.
 */
var express = require('express');
var router = express.Router();
var surveys = require('../models/surveyListModel');
var participants = require('../models/participantModel');


//Returns all surveys of a user if logged in
router.get('/getSurveyList', function (req, res){
    authenticate (req,res, function(){
        var username = req.user.username;
        findSurveyList(username, function(names){
            res.json({
                name: username,
                id:req.user.id,
                survey: names
            });
        })


    });
});

//Returns data relevant to one survey
router.get('/getSurvey', function (req, res){
    authenticate (req,res, function(){
        findSurvey(req.query.id, function(data){
            res.json(data);
        })
    });
});

//Returns data relevant to one survey
router.post('/saveSurvey', function (req, res){
    authenticate (req,res, function(){
        saveSurvey(req, function(id){
            res.json(id);
        })
    });
});

//Returns participants of a survey
router.post('/getParticipants', function (req, res){
    authenticate (req,res, function(){
        findParticipants(req.query.id, function(participants){
            res.json({participants:participants});
        })
    });
});

router.post('/addParticipants', function (req, res){
    authenticate (req,res, function(){
        participantExists(req.body.email,req.query.id, function(array){
            res.json({participants: array});
        })
    });
});
//Calls cb method if user authenticated,
//else redirects
var authenticate = function(req,res,cb){
  if (req.user) {
      cb();
  }
  else res.redirect('/');
};

//finds all Surveys with given username
function findSurveyList(username, cb){
    surveys.find({username : username}, function(err, survey) {
        if (err) throw err;
        var str = [];
        var id = [];
        for(var i = 0; i < survey.length; i++){
            str[i] = [survey[i].name, survey[i]._id];
        }
        cb(str);
    });
}

function findSurvey(id, cb){
    surveys.findOne({_id: id}, function (err, survey) {
        var myObj = {};
        myObj.questions = survey.questions;
        myObj.editable = survey.editable;
        myObj.name = survey.name;
        myObj.id = survey._id;
        cb(myObj);
    });
}

function findParticipants(id, cb){
    surveys.findOne({"_id" : id}, function(err, survey) {
        console.log(JSON.stringify(survey));
        if (err) console.log("LOgging error in find"+err);
        cb(survey.participants);
    });
}

//if participant exists, add to survey, calls callback with participant list
function participantExists(email, surveyid,cb){

    //check if participant exists
    participants.find({email : email}, function(err, participant) {
        if (err) throw err;

        //if participant exists then add to survey
        if(participant[0]!=undefined){
            surveys.findOneAndUpdate({_id:surveyid},{$addToSet:{"participants":participant[0].email}},
                function(err,model){
                    if (err){console.log(err.toString())}
                    else
                    {   //Since this returns list before update,
                        //add email to list if not already in list
                        var exists = false;
                        for (var i = 0; i < model.participants.length; i++) {
                            if (model.participants[i] == email){
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) model.participants.push(email);
                    }
                    //send back participants to controller for display.
                    cb(model.participants)
                });
        }
        else{
            cb([]);
        };
    });
}

// Save Survey, update if already exists
//Todo : Handle saving error
function saveSurvey(req,cb){
    var id = req.body.id;
    if (id==null){
        var survey = new surveys({
            questions: req.body.questions,
            editable: req.body.editable,
            name: req.body.name,
            username: req.user.username
        });
        survey.save(function(err, surv){
            if (err) console.log("Error save Survey :" + error );
            cb({id:surv._id});
        });
    }
    else {
        surveys.update({_id: id}, {
            $set: {
                questions: req.body.questions,
                editable: req.body.editable,
                name: req.body.name
            }
        }, {}, function (err, numAffected) {
            if (err) console.log(err);
            cb({id:id});
        });
    }
}

module.exports = router;