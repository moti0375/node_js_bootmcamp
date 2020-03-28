const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

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
    minlength: [8, 'A password must have at least 8 charachters']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
    trim: true,
    minlength: [8, 'A password must have at least 8 charachters']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
