const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour must have at most 40 characters'],
      minlength: [10, 'A Tour must have at least 10 characters']
    },
    slug: String,
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
      default: 4.5,
      min: [1, 'Rating average must be greater than 1.0'],
      max: [1, 'Rating average must be less than or equal than 5.0']
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
      required: [true, 'A Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be one of "easy", "medium" or "difficult"'
      }
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
      default: Date.now(),
      select: false //Will be not selected by default
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//Document pre save middleware, runs before save and create
tourSchema.pre('save', function(next) {
  // console.log(`Save middleware ${JSON.stringify(this)}`);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Document post save middleware, runs after save and create actions
tourSchema.post('save', function(doc, next) {
  console.log(`Post middleware: ${JSON.stringify(doc)}`);
  next();
});

//Query pre find middleware, will run before any find query
tourSchema.pre(/^find/, function(next) {
  //The regex will match all queries starting with find
  //processing a query
  console.log(`Query middleware was called`);
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//Query post find middleware, will run before any find query
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Command tooks: ${Date.now() - this.start} mSec`);
  next();
});

//Query pre aggregation middleware, will run before any find query
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({
    //Add an element and the top of an array
    $match: {
      secretTour: { $ne: true }
    }
  });
  console.log(this);
  console.log(`Aggregation middleware: called`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
