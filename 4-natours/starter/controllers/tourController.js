const fs = require('fs');
const Tour = require('../models/tourModel.js');

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

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    console.log(queryObj);
    excludeFields.forEach(field => delete queryObj[field]);
    console.log(queryObj);

    // const toues = await Tour.find(queryObj); //This will run the mongoose query without keeping the query obj for later
    const toursQuery = Tour.find(queryObj); //Saving the mongoose query into a const to use it later on

    const tours = await toursQuery
      .find()
      .where('duration')
      .equals(5)
      .where('difficulty')
      .equals('easy');

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const ture = await Tour.findOne({ _id: req.params.id });  same as findById

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: 1,
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = Tour({ name: req.body.name, price: req.body.price, rating: req.body.rating });

  try {
    const newTourDoc = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTourDoc
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  //TODO: handle update a tour ...

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true //The validators will run again when updating a document
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // const deletById = await Tour.deleteOne({ _id: req.params.id });
    await Tour.findByIdAndDelete(req.params.id); //same as deleteOne

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};
