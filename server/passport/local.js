const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('../../config');

module.exports = {
  /**
   * Login via JWT strategy
   * @param {object}
   *   string - JWT token from HTTP body message
   *   string - secret key from config file
   * @return {object}
   *   boolean - success\error
   *   object - user from DB
   *   object with error message
   */

  loginByToken() {
    const params = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
      passReqToCallback: true
    };

    return new JwtStrategy(params, (req, payload, done) => {
      User.findOne({email: payload.email}, (err, user) => {
        if (err) return done(err);

        if (user === null) {
          return done(null, false, { message: "The user in the token was not found" });
        }

        return done(null, {_id: user._id, email: user.email});
      });
    });
  }
};