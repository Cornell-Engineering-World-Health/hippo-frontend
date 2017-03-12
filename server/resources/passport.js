var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

var User = require('../models/user')

var passport = require('passport')

  passport.serializeUser(function (user, done) {
    done(null, user.userId)
  })

  passport.deserializeUser(function (id, done) {
    User.find({ 'userId': id }, function (err, user) {
      done(err, user)
    })
  })

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_SECRET_KEY,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL
  },
  function (token, refreshToken, profile, done) {
    console.log(profile)
    process.nextTick(function () {
      User.findOne({ 'google.id' : profile.id }, function (err, user) {
        if (err) {
          return done(err)
        }
        if (user) {
          return done(null, user)
        } else {
          var newUser = new User()
          newUser.google.id = profile.id
          newUser.google.token = token
          newUser.firstName = profile.name.givenName
          newUser.lastName = profile.name.familyName
          newUser.email = profile.emails[0].value
          newUser.calls = []
          newUser.contacts = []

          newUser.save(function (err, savedUser) {
            if (err) {
              throw err;
            }
            return done(null, savedUser)
          })
        }
      })
    })
  }))

module.exports = passport
