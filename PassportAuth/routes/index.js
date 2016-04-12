//var express = require('express');
//var passport = require('passport');
//var router = express.Router();

exports.index = function(req, res){
    res.render('index');
};

exports.partials = function(req, res){
    var filename = req.params.filename;
    if(!filename) return;  // might want to change this
    res.render("partials/"+filename, {name: "Abc", surveys : ["Abc D"]} );
};
/* GET home page. */
/*
router.get('/', function(req, res, next) {
    var msg = req.flash('error');
    console.log("FLASH:"  + msg);
  res.render('index', { message: msg, test:msg });
});

*/

