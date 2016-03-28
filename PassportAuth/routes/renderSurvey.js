/**
 * Created by sanji on 2/20/2016.
 */
var express = require('express');
var router = express.Router();
var surveys = require('../models/surveyListModel');

var query = undefined;
var newSurvey = undefined;

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.user) {
        query = req.query.nm;
        newSurvey = false;
        if (req.query.new == 'yes'){
            query = 'yes';
            newSurvey = true;
            console.log(query);
        }
        res.render('renderSurvey',{params: req.query.nm});
    }
    else {
        res.redirect('/');
    };
});

router.get('/getSurvey', function (req, res){
    console.log(newSurvey);
    if (newSurvey){
        var myObj = {};
        myObj.questions = [];
        myObj.editable = true;
        myObj.name = null;
        myObj.id = null;
        res.json(myObj);
    }
    else{
        surveys.findOne({name: query, username:req.user.username}, function (err, survey) {
            var myObj = {};
            console.log("Logging username:" + req.user);
            myObj.questions = survey.questions;
            myObj.editable = survey.editable;
            myObj.name = survey.name;
            myObj.id = survey._id;
            res.json(myObj);
        })
    }
});

router.post('/saveSurvey', function(req,res){
    console.log("in saveSurvey");
    console.log(req.body);

    if (req.body.id !=null) {
        surveys.update({_id: req.body.id}, {
            $set: {
                questions: req.body.questions,
                editable: req.body.editable,
                name: req.body.name
            }
        }, {}, function (err, numAffected) {
            console.log("Updated and Num Affected " + numAffected);
        })
    } else {
        console.log("Insertion Error");
        var survey = new surveys({
            questions: req.body.questions,
            editable: req.body.editable,
            name: req.body.name,
            username: req.user.username
        })
        survey.save(function(err, surv){if (err) console.log("Error :" + error )});
    }
    res.redirect('/users');
});
module.exports = router;