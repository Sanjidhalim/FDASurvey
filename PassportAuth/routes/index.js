var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var msg = req.flash('error');
    console.log("FLASH:"  + msg);
  res.render('index', { message: msg, test:msg });
});


router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/users',
        failureRedirect: '/',
        failureFlash: true
    })
);

module.exports = router;
