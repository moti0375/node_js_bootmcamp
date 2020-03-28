const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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

const User = mongoose.model('User', userSchema);
module.exports = User;
