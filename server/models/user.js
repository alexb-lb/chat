const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// define the User model schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // if no value exists, will be error
    trim: true, // trim white spaces in the start and the on of the string
    minlength: 1, // check length
    unique: true, // unique restriction, cannot be two same emails
    validate: {
      // built-in validate function in mongoose.js
      validator: validator.isEmail // and this is third party library named 'validator'
    },
    message: '{VALUE} is not a valid email',
  },
  password: {
    type: String,
    required: true, // if no value exists, will be error
    trim: true, // trim white spaces in the start and the on of the string
    minlength: 6 // check length
  },
  name: String
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  if(this.isModified('password')){
    bcrypt.hash(this.password, 10, (err, hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

/**
 * The pre-update hook method.
 */
UserSchema.pre("update", function (next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

/**
 * Compare the passed password with the value in the database. A model method.
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
  let password = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

const User = mongoose.model('user', UserSchema);

module.exports = User;
