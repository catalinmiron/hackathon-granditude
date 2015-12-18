"use strict";
var LocalStrategy = require("passport-local").Strategy;
var authenticator = require("../lib/authenticator");
var User = require("mongoose").model("User");
var FacebookStrategy = require('passport-facebook').Strategy;

var serialize = function(user, done) {
  done(null, user._id);
};

var deserialize = function(id, done) {
  User.findById(id, done);
};

module.exports = function(passport, config) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new LocalStrategy(authenticator.localUser));
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos']
    },
    function(token, tokenSecret, profile, done) {
      console.log(config);
      console.log(token);
      console.log(tokenSecret);
      console.log(profile);
      User.findOne({ 'facebook': profile.id }, function(err, user) {
        if (err) { console.log(err); }
        if (!err && user !== null) {
          user.save(function(err) {
            if (err) { console.log(err); }
            done(null, user);
          });
        } else {
          var newUser = new User();
          newUser.facebook = profile.id;
          newUser.username = profile.displayName;
          newUser.avatar = 'http://graph.facebook.com/' + profile.id + '/picture?width=100&height=100'
          newUser.token = token;
          newUser.secret = tokenSecret;
          newUser.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              done(null, user);
            }
          });
        }
      });
    }
  ))
};
