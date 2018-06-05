const passport = require('passport');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const moment = require('moment');

const User = require('../models/user');

/**
 * Set user info for response to client
 * @param user - user object
 * @returns res with user cookie, which includes generated token
 */
const setUserInfo = ({_id, name}) => {
  return {_id, name, token: genToken({_id, name})};
};

/**
 * Generate token from user object
 * @param user object - get user._id and user.name, generate token with them
 * @returns token string
 */
const genToken = ({_id, name}) => {
  const exp = moment().utc().add({days: 2}).unix();
  return 'Bearer ' + jwt.sign({_id, name, exp}, process.env.JWT_SECRET);
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

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 6) {
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

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 6) {
    validationResult.success = false;
    validationResult.message = 'Password must have at least 8 characters.';
    validationResult.errorInElement = 'password';
    return validationResult;
  }

  return validationResult;
};

const AuthController = {

  /**
   * Validate user token user first request to server
   * @param res - get user Authorization bearer token from response object
   *   check if token exists
   *   check if token valid
   *   check if token time not expired
   *
   * @returns
   *   success - boolean
   *   message - server message
   *   user - user info
   *   {success: true, message: "server message", user: {_id, name}}
   */
  authenticate: (req, res, next) => {
    return passport.authenticate('jwt', {session: false, failWithError: true}, (payload, info) => {
        if (!payload) {
          if (info.name === "TokenExpiredError") {
            return res.status(401).json({success: false, message: 'Token has expired'});
          } else {
            return res.status(401).json({success: false, message: 'Token damaged'});
          }
        }
        return res.status(200).json({success: true, message: 'OK', user: setUserInfo(payload)});
      }
    )(req, res, next);
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
   * @returns res with status 200 or 404
   */
  login: async (req, res) => {
    try {
      const validationResult = validateLoginForm(req.body);
      if (!validationResult.success) throw validationResult;

      let user = await User.findOne({email: req.body.email});
      if (user === null) throw {success: false, message: 'User not found', errorInElement: false};

      let success = await user.comparePassword(req.body.password);
      if (success === false) throw {success: false, message: 'Incorrect password', errorInElement: 'password'};

      res.status(200).json({success: true, user: setUserInfo(user)});
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
      .then(() => res.status(200).json({success: true, user: setUserInfo(user)}))
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
          message: 'Could not process the form.',
          errorInElement: false
        });
      });
  },

  /**
   * Authentication via Facebook API
   */
  authenticateFacebookRequest: (req, res, next) => {
    console.log('called authenticateFacebookRequest');
    // const options = {scope: ['public_profile', 'email', 'user_birthday']};
    return passport.authenticate('facebook')(req, res, next);
  },

  authenticateFacebookResponse: (req, res, next) => {
    console.log('called authenticateFacebookResponse');
    return passport.authenticate('facebook', { failureRedirect: '/login' },(err, user) => {
      console.log('Err', err);
      console.log('user', user);

      // Successful authentication, redirect home.
      res.redirect('/');
    })(req, res, next)
  },
};

module.exports = {AuthController, genToken};
