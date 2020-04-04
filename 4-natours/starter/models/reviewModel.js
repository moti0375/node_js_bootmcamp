//review, rating, createdAt, ref to a Tour, ref to a User
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review cannot be empty'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'A review must have rating'],
      min: [1, 'Rating must be greater than 1.0'],
      max: [5, 'Rating must be less than or equal than 5.0']
    },
    createAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A Review must belong to a tour.']
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Review must belong to a user']
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } } //Adding virtual field (a calculated value which not stored in database) to the json or object
);

reviewSchema.pre(/^find/, function(next) {
  this.find().populate({
    path: 'author',
    select: 'name photo'
  });

  next();
});

reviewSchema.pre('save', function(next) {
  // console.log(`Save middleware ${JSON.stringify(this)}`);
  this.createAt = Date.now();
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
