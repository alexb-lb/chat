const jwt = require('jsonwebtoken');
const validator = require('validator');
const passport = require('passport');
const moment = require('moment');

const User = require('../models/user');
const config = require('../../config');

/**
 * Set cookie with user info and token for 1 week
 * @param res - set user cookie
 * @param user - user object
 * @returns res with user cookie, which includes generated token
 */
const setResponseCookie = (res, user) => {
  const userCookie = {
    _id: user._id,
    name: user.name,
    token: genToken(user)
  };
  res.cookie('user', userCookie, {maxAge: 604800000});
  return userCookie;
};

/**
 * Generate token from user object
 * @param user object - get user._id and user.name, generate token with them
 * @returns token string
 */
const genToken = ({_id, name}) => {
  return jwt.sign({_id, name}, config.jwtSecret);
};

/**
 * Validate the register form
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains:
 *   boolean validation result,
 *   error message
 *   client side element name where error occurs
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

/**
 * Validate the login form
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains:
 *   boolean validation result,
 *   error message
 *   client side element name where error occurs
 */
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
  /**
   * Validate user token user first request to server
   * @param res - get user cookie from response object
   *   check if cookie.user object exists
   *   check if cookie.user.token object exists
   *   check if cookie.user.token valid
   *   update res.cookie.user time to expire if all is ok
   *
   * @param req - pass decoded user info from token
   *   into req.params.user like {_id, name}
   *
   * @returns
   *   next
   *   updated cookie time
   */
  authenticate: (req, res, next) => {
    const userCookie = req.cookies.user;

    // check if cookie exists and if has inside it token param or delete cookie "user"
    if (!userCookie || !userCookie.token) {
      res.clearCookie('user');
      return next();
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(userCookie.token, config.jwtSecret);
    } catch (e){
      console.log(`Token ${userCookie.token} broken: ${e}`);
      res.clearCookie('user');
      return next();
    }

    // pass user info to req
    req.params.user = decodedToken;
    // re-update cookie time if all is ok
    setResponseCookie(res, decodedToken);

    return next();
  },

  /**
   * LOGIN method
   * @param req
   *   get form filed from req.body like {email, password}
   *   validate form fields
   *   check if user exists in DB
   *   check if user password equal to password from form field
   * @param res
   *   set cookie "user" with generated token if all is ok,
   *   like {_id, name, token}
   * @returns res with status 200 ot 404
   */
  login: async (req, res) => {
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

  /**
   * REGISTER method
   * @param req
   *   get form filed from req.body like {email, password, name}
   *   validate form fields
   *   save user into DB
   * @param res
   *   set cookie "user" with generated token if all is ok,
   *   like {_id, name, token}
   * @returns res with status 200 ot 404
   */
  register(req, res){
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
  }
};
