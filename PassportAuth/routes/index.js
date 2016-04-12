//var express = require('express');
//var passport = require('passport');
//var router = express.Router();

//Renders sign in page if not logged in
//else renders admin page
exports.index = function(req, res){
    if (!req.user || req.user) res.render('index');
    //res.redirect('/users');
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

