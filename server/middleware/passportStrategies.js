const passport = require('passport');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const moment = require('moment');

// strategies
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

const User = require('../models/user');

module.exports = {
  jwtStrategy: (req, res, next) => {
    const params = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    };

    return new JwtStrategy(params, (payload, done) => {
      // done will be with 2 params: payload and hidden info parameters
      return done(payload);
    });
  },

  facebookStrategy: () => {
    return new FacebookTokenStrategy({
        clientID: 240411823374286,
        clientSecret: 'ef06ac395eb99de36191b96f44b45fdf',
        // callbackURL: process.env.DOMAIN + '/auth/facebook/callback',
        // profileFields: ['id', 'first_name', 'last_name', 'link', 'gender', 'picture', 'verified', 'email', 'birthday']
      }, (accessToken, refreshToken, profile, done) => {
        // User.findOrCreate({ facebookId: profile.id }, (err, user) => {
        //   return cb(err, user);
        // });
        return done(null, profile);
      }
    )
  },
};

