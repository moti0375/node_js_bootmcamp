const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//Required fields: name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'A User must have an email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin']
    },
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'A User must have a password'],
    trim: true,
    minlength: [8, 'A password must have at least 8 charachters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
    trim: true,
    minlength: [8, 'A password must have at least 8 charachters'],
    validate: {
      message: `Passwords are not the same `,
      validator: function(val) {
        //Will not work on update, as this. update dosen't have access to price field. Will work only on new Doc
        return val === this.password;
      }
    }
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
});

//Document pre save middleware, runs before save and create
userSchema.pre('save', async function(next) {
  console.log(`User Save middleware ${JSON.stringify(this)}`);
  if (!this.isModified('password')) return next(); //Only do if password has been modified
  this.password = await bcrypt.hash(this.password, 12); //Hash the password with cost of 12
  this.passwordConfirm = undefined; //Removing the confirmation password from the database
  next();
});

userSchema.methods.correctPassword = async function(hashedPassword, enteredPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

userSchema.methods.changedPasswordAfter = async function(jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(`PasswordChangedAt: ${changedTimestamp} jwtTimestamp: ${jwtTimestamp}`);
    if (jwtTimestamp < changedTimestamp) {
      console.log('User changed password after token issued...');
      return true;
    }
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); //Creating the reset token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); //Encrypt the reset token and save it in the database, like we encrypt passwords

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 Seconds
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
