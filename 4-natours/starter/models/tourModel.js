const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A Tour must have a duration']
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty']
  },
  discount: {
    type: Number
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a imageCover']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
