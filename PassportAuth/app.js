var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//setup Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mongooseDB');

//passport setup
var passport = require ('passport');
var initPassport = require('./Authentication/auth');
initPassport(passport);


//schedule jobs
var date = new Date(2016, 3, 17, 21, 30, 0);
var j = schedule.scheduleJob(date, function(){
    console.log('The world is going to end today.');
})

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//app.use('/css/stylesheet', express.static(path.join(__dirname, '/public/stylesheets/style.css')));
app.use('/public',express.static(path.join(__dirname, '/public')));

var routes = require('./routes');

app.use('/data',require('./routes/data'));
app.use('/api',require('./routes/api'));

/**********LOG IN/ LOG OUT **********/
app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/users',
        failureRedirect: '/',
        failureFlash: true
    })
);

app.post('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/users',
    failureRedirect: '/signup',
    failureFlash : true
}));


app.get('/', routes.index);
app.get('/partials/:filename', routes.partials);
app.get('*', routes.index);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
