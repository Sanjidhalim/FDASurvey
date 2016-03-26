/**
 * Created by sanji on 2/23/2016.
 */
var express = require('express');
var router = express.Router();
var surveys = require('../models/surveyListModel');
var participants = require('../models/participantModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.user){
        var myName= req.user.username;
        var surveyName = req.query.nm;
        var surveyId = req.query.id;
        console.log("Id of survey" + surveyId);
        findParticipants(myName, surveyName, function(data){
            res.render('participants', { participants: data, name:surveyName, surveyID:surveyId });
        } );
    }
    else {
        res.redirect('/');
    };
});



router.post('/addParticipants', function (req,res,next){
    //participants.update({email:req.query.participantEmail},{$push:{}})
    participantExists(req.body.participantEmail, req.query.id, res);
} )

function findParticipants(username, surveyName, cb){
    surveys.find({username : username,  name: surveyName}, function(err, survey) {
        if (err) throw err;
        cb(survey[0].participants);
    });
}

function participantExists(email, surveyid, res){
    participants.find({email : email}, function(err, participant) {
        if (err) throw err;
        console.log(participant);
        if(participant[0]!=undefined){
            participants.update({"_id":participant[0]._id},{$push: {"surveys": surveyid}});
            surveys.update({_id:surveyid},{$push:{"participants":participant[0].email}},
                function(err,model){
                    if (err){ res.send(err.toString())}
                    else {res.redirect('back')};
                });
        }
        else{
            console.log("Participant not found");
            res.redirect('back');
        };
    });
}

module.exports = router;

