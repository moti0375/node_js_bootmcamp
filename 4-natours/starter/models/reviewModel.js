//review, rating, createdAt, ref to a Tour, ref to a User
const Tour = require('./tourModel.js');
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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Review must belong to a user']
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } } //Adding virtual field (a calculated value which not stored in database) to the json or object
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.find().populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

reviewSchema.pre('save', function(next) {
  // console.log(`Save middleware ${JSON.stringify(this)}`);
  this.createAt = Date.now();
  next();
});

reviewSchema.statics.calculateAverageRatings = async function(tourId) {
  const stat = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]); //this points to the model
  console.log(`calculate Average Ratings: ${JSON.stringify(stat)}`);
  if (stat.length > 0) {
    await Tour.findByIdAndUpdate(tourId, { ratingsQuantity: stat[0].nRating, ratingsAverage: stat[0].avgRating });
  } else {
    //There are still no reviews, set it to defaults
    await Tour.findByIdAndUpdate(tourId, { ratingsQuantity: 0, ratingsAverage: 4.5 });
  }
};

reviewSchema.post('save', function(next) {
  this.constructor.calculateAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne(); //Save it to the query, so it can be accessed in the post middleware
  console.log(`pre findOneAnd:`);

  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  console.log(`findOneAnd post: tourId: ${this.r.tour}`);
  // const tour = await Tour.findOne(this.r.tour);
  await this.r.constructor.calculateAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
