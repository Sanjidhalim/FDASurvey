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
        findSurveys(username, function(names){
            res.json({
                name: username,
                id:req.user.id,
                survey: names
            });
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

//finds all Surveys with gven username
function findSurveys(username, cb){
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
module.exports = router;