var express = require('express');
var flash = require('connect-flash');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

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

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//app.use(express.static(path.join(__dirname, '/public')));
app.use('/public',express.static(path.join(__dirname, '/public')));

/*
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/signup',require('./routes/signup'));
app.use('/renderSurvey',require('./routes/renderSurvey'));
app.use('/participants',require('./routes/participants'));
app.use('/api',require('./routes/api'));
*/

var routes = require('./routes');

app.get('/', routes.index);
app.get('/partials/:filename', routes.partials);
app.get('*', routes.index);


app.post('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


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
