const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// define the User model schema
const UserSchema = new mongoose.Schema({

  name: String,
  birthDate: Number,
  sex: String,
  avatar: String,
  photos: Array,
  lookingForSex: String,
  lookingForAgeRange: {
    from: {
      type: Number,
      default: 18
    },
    to: {
      type: Number,
      default: 65
    }
  },

  local: {
    email: {
      type: String,
      trim: true, // trim white spaces in the start and the on of the string
      minlength: 3, // check length
      validate: { // built-in validate function in mongoose.js
        validator: validator.isEmail // third-party library 'validator'
      },
      message: '{VALUE} is not a valid email',
    },
    password: {
      type: String,
      trim: true, // trim white spaces in the start and the on of the string
      minlength: 6 // check length
    }
  },

  facebook: {
    id: String,
    token: String,
    email: String
  },

  google: {
    id: String,
    token: String,
    email: String
  },

  vkontakte: {
    id: String,
    token: String,
    email: String
  }
}, {timestamps: {createdAt: "created_at", updatedAt: "updated_at"}});

/**
 * The pre-save hook method.
 */
UserSchema.pre('save', function saveHook(next) {
  if (this.isModified('local.password')) {
    bcrypt.hash(this.local.password, 10, (err, hash) => {
      this.local.password = hash;
      next();
    });
  } else {
    next();
  }
});

/**
 * The pre-update hook method.
 */
UserSchema.pre("update", next => {
  if (this.local.password) {
    bcrypt.hash(this.local.password, 10, (err, hash) => {
      this.local.password = hash;
      next();
    });
  } else {
    next();
  }
});

/**
 * Compare the passed password with the value in the database. A model method.
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
  const password = this.local.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

const User = mongoose.model('user', UserSchema);

module.exports = User;
