const Tour = require('../models/tourModel.js');
const ApiFeaturs = require('../utils/apiFeaturs');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError');

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

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Execute the query
  const features = await new ApiFeaturs(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  //Sending the response
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // const ture = await Tour.findOne({ _id: req.params.id });  same as findById

  console.log(`getTour: ${tour}`);
  if (!tour) {
    return next(new AppError(`Cannot find such tour with this id: ${req.params.id}`), 404);
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 1,
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = Tour({ name: req.body.name, price: req.body.price, rating: req.body.rating });
  console.log('createATour was called');
  const newTourDoc = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTourDoc
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true //The validators will run again when updating a document
  });

  if (!tour) {
    return next(new AppError(`Cannot find such tour with this id: ${req.params.id}`), 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  // const deletById = await Tour.deleteOne({ _id: req.params.id });
  const tour = await Tour.findByIdAndDelete(req.params.id); //same as deleteOne

  if (!tour) {
    return next(new AppError(`Cannot find such tour with this id: ${req.params.id}`), 404);
  }

  res.status(200).json({
    status: 'success',
    data: null
  });
});

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
