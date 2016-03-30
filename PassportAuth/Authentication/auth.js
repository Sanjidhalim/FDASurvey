/**
 * Created by sanji on 2/16/2016.
 */

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
//var mongoose = require('mongoose');

User = require('../models/usermodel');

module.exports = function(passport) {

// Passport session setup
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

//Define strategies
    passport.use('local', new LocalStrategy(
        function (username, password, done) {
            console.log("inLocalStrategy with username " + username.toString());
            User.findOne({username: username}, function (err, user) {
                //console.log(user.toString());
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message:'Username does not exist'});
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {message: 'Invalid password'});
                }
                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            console.log("Inside new user :" + username + " " + password);
            findOrCreateUser = function () {
                // find a user in Mongo with provided username
                User.findOne({'username': username}, function (err, user) {
                    // In case of any error return
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists');
                        return done(null, false,
                            console.log('User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = password;

                        // save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );
}