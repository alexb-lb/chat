const jwt = require('jsonwebtoken');
const validator = require('validator');
const passport = require('passport');
const moment = require('moment');

const User = require('../models/user');
const config = require('../../config');

const genToken = (user) => {
  let expires = moment().utc().add({days: 7}).unix();
  let token = jwt.sign({
    exp: expires,
    name: user.name
  }, config.jwtSecret);

  return {
    token: "JWT " + token,
    expires: moment.unix(expires).format()
  };
};

/**
 * Set cookie for 1 week
 * @param res
 * @param user
 */
const setResponseCookie = (res, user) => {
  const userCookie = {
    userId: user._id,
    userName: user.name,
    token: genToken(user)
  };
  res.cookie('user', JSON.stringify(userCookie), {maxAge: 604800000});
  return userCookie;
};

/**
 * Validate the register form
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains:
 *  boolean validation result,
 *  error message
 *  client side element name where error occurs
 */
const validateRegisterForm = (payload) => {
  const validationResult = {
    success: true,
    message: '',
    errorInElement: false
  };

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    validationResult.success = false;
    validationResult.message = 'Please provide a correct email address.';
    validationResult.errorInElement = 'email';
    return validationResult;
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    validationResult.success = false;
    validationResult.message = 'Password must have at least 8 characters.';
    validationResult.errorInElement = 'password';
    return validationResult;
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    validationResult.success = false;
    validationResult.message = 'Please provide your name.';
    validationResult.errorInElement = 'name';
    return validationResult;
  }

  return validationResult;
};

const validateLoginForm = (payload) => {
  const validationResult = {
    success: true,
    message: '',
    errorInElement: false
  };

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    validationResult.success = false;
    validationResult.message = 'Please provide a correct email address.';
    validationResult.errorInElement = 'email';
    return validationResult;
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    validationResult.success = false;
    validationResult.message = 'Password must have at least 8 characters.';
    validationResult.errorInElement = 'password';
    return validationResult;
  }

  return validationResult;
};

module.exports = {
  authenticate: (req, res, next) => {
    setResponseCookie(res, false);

    return passport.authenticate("loginByToken", {session: false, failWithError: true},
      (err, user, info) => {
        if (user) {
          setResponseCookie(res, user);
        }
        return next();
        // if (err) return next(err);
        //
        // if (!user) {
        //   if (info.name === "TokenExpiredError") {
        //     return next({message: "Token has expired"});
        //   } else {
        //     return next({message: info.message});
        //   }
        // }

      })(req, res, next);
  },

  /**
   * Login authorization
   * First checks token with jwt passport strategy
   * if token not found, continue to check if req.body contains email and password
   */
  login: async (req, res, next) => {
    try {
      const validationResult = validateLoginForm(req.body);
      if (!validationResult.success) throw validationResult;

      let user = await User.findOne({email: req.body.email});
      if (user === null) throw {success: false, message: 'User not found'};

      let success = await user.comparePassword(req.body.password);
      if (success === false) throw {success: false, message: 'Incorrect password'};

      const userData = setResponseCookie(res, user);
      res.status(200).json({success: true, user: userData});
    } catch (err) {
      res.status(404).json(err);
    }
  },

  // REGISTER
  register(req, res, next){
    const validationResult = validateRegisterForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json(validationResult);
    }

    const user = new User(req.body);
    user.save()
      .then(() => {
        const userData = setResponseCookie(res, user);
        res.status(200).json({success: true, user: userData});
      })
      .catch((err) => {
        // the 11000 Mongo code is for a duplication email error
        if (err.code === 11000) {
          // the 409 HTTP status code is for conflict error
          return res.status(409).json({
            success: false,
            message: 'This email is already taken',
            errorInElement: 'email'
          });
        }

        return res.status(400).json({
          success: false,
          message: 'Could not process the form.'
        });
      });
  },

  // LOGOUT
  logout(req, res){
    // res = setCookie(res, false);
    res.cookie('user', false, {maxAge: 604800000});
    return res.status(200);

  },
};
