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
    //1) Filtering (projection)
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(field => delete queryObj[field]);
    console.log(req.query);

    //2) Advanced filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\bgte|gt|lte|lt\b/g, match => {
      console.log(`matched ${match}`);
      return `$${match}`;
    });

    queryString = queryString.replace('.', () => {
      ' ';
    });

    console.log(`Filtered queryString: ${queryString}`);
    const filteredQuery = JSON.parse(queryString);
    console.log(filteredQuery);
    // {difficulty: 'easy', duration: {$gte : 5}}
    // const toues = await Tour.find(queryObj); //This will run the mongoose query without keeping the query obj for later
    let toursQuery = Tour.find(filteredQuery); //Saving the mongoose query into a const to use it later on

    //3) Sorting
    if (req.query.sort) {
      const sortStr = req.query.sort.split('.').join(' ');
      console.log(`Sort query: ${sortStr}`);
      toursQuery = toursQuery.sort(sortStr);
    } else {
      toursQuery = toursQuery.sort('createdAt');
    }

    //3) Field Limiting (selection)
    if (req.query.fields) {
      const fields = req.query.fields.split('.').join(' ');
      console.log(fields);
      toursQuery = toursQuery.select(fields);
    } else {
      toursQuery = toursQuery.select('-__v'); //If no fields specified, remove this field which is created by mongoose (minus means remove this field)
    }

    const tours = await toursQuery;

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
