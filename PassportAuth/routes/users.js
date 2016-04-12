var express = require('express');
var router = express.Router();
var surveys = require('../models/surveyListModel');
var participants = require('../models/participantModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.user){
    var myName = req.user.username;
    showSurveys(myName, function(data , ids){
        res.render('users', { surveys: data, id:ids, name:myName });
    } );
  }
  else {
    res.redirect('/');
  };
});



function showSurveys(username, cb){
    surveys.find({username : username}, function(err, survey) {
        if (err) throw err;
        var str = [];
        var id = [];
        for(var i = 0; i < survey.length; i++){
            str[i] = survey[i].name;
            id[i] = survey[i]._id;
        }
        cb(str, id);
    });
}
module.exports = router;
