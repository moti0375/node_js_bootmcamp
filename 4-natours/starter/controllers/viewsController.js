const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  console.log('getOverView');
  //1. Get all tours from our collection
  const tours = await Tour.find();
  //2. Build template

  //3. Render the template using data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours
  });
  next();
});

exports.getTourDetails = catchAsync(async (req, res, next) => {
  console.log('getTourDetails');
  res.status(200).render('tour', {
    title: 'Forest Hiker'
  });

  next();
});
