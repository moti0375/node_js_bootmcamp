const Tour = require('../models/tourModel.js');
const catchAsync = require('../utils/catchAsync.js');
const factory = require('./handleFactory');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)); //Now we will get the data from mongoose

//Used when we worked localy
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id: ${val}`);
//   const id = val * 1;
//   const tour = tours.find(t => t.id === id);
//   //   console.log(tour);

//   if (tour === undefined) {
//     console.log(`Tour CheckId middleware ${id} undefined`);
//     return res.status(404).json({
//       status: 'Failed',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

//Check if the body contains the name and the price properties
//Not required anymore as the mongoose schema has required notations
// exports.checkBody = (req, res, next) => {
//   console.log('Hello from check body middleware');
//   const { body } = req;
//   const { name } = body;
//   const { price } = body;

//   if (name === undefined || price === undefined) {
//     console.log('Hello from check body middleware, something is wrong 👎🏻');

//     return res.status(404).json({
//       status: 'Failed',
//       error: 'Invalid body fields!'
//     });
//   }
//   console.log("Hello from check body middleware, you're all set 👍🏻");

//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  console.log(`aliasTopTours middleware:`);
  req.query = { ratingsAverage: { gt: '4' } };
  req.query.limit = '5';
  req.query.fields = 'name.duration.difficulty.price.ratingsAverage';
  req.query.sort = '-ratingsAverage.-price';

  console.log(req.query.limit);
  next();
};

exports.createTour = factory.createOne(Tour);
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

//Use Factory now!!
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // const deletById = await Tour.deleteOne({ _id: req.params.id });
//   const tour = await Tour.findByIdAndDelete(req.params.id); //same as deleteOne

//   if (!tour) {
//     return next(new AppError(`Cannot find such tour with this id: ${req.params.id}`), 404);
//   }

//   res.status(200).json({
//     status: 'success',
//     data: null
//   });
// });

exports.getToursStats = catchAsync(async (req, res, next) => {
  console.log('getToursStats');
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numOfTours: { $sum: 1 },
        numOfRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgRating: -1 }
    }
    // ,
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    stats
  });
});

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // * 1 - transfrom to number
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: `$startDates` },
        numOfTours: { $sum: 1 },
        tours: { $push: `$name` }
      }
    },
    {
      $addFields: {
        month: `$_id`
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numOfTours: -1 }
    }
  ]);
  console.log(`getMontlyPlan: ${JSON.stringify(req.params)}`);
  res.status(200).json({
    status: 'success',
    results: plan.length,
    plan
  });
});
