const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  console.log('getOverView');
  res.status(200).render('base', {
    tour: 'Eilat Israel',
    user: 'Moti Bartov'
  });
});

exports.getTourDetails = catchAsync(async (req, res) => {
  console.log('getTourDetails');
  res.status(200).render('tour', {
    title: 'Forest Hiker'
  });
});
