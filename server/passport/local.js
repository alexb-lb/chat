const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('../../config');

module.exports = {

  loginByToken() {
    const params = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
      passReqToCallback: true
    };

    return new JwtStrategy(params, (req, payload, done) => {
      User.findOne({_id: payload.userId}, (err, user) => {
        if (err) return done(err);

        if (user === null) {
          return done(null, false, { message: "The user in the token was not found" });
        }

        return done(null, {_id: user._id, name: user.name});
      });
    });
  }
};