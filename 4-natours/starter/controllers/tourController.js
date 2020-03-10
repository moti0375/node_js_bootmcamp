const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log('Tour id: ' + val);
  const id = val * 1;
  const tour = tours.find(tour => tour.id === id);
  //   console.log(tour);

  if (tour === undefined) {
    console.log(`Tour CheckId middleware ${id} undefined`);
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID'
    });
  }
  next();
};

//Check if the body contains the name and the price properties
exports.checkBody = (req, res, next) => {
  console.log('Hello from check body middleware');
  const { body } = req;
  const { name } = body;
  const { price } = body;

  if (name === undefined || price === undefined) {
    console.log('Hello from check body middleware, something is wrong 👎🏻');

    return res.status(404).json({
      status: 'Failed',
      error: 'Invalid body fields!'
    });
  }
  console.log("Hello from check body middleware, you're all set 👍🏻");

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(tour => tour.id === id);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 1,
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

exports.updateTour = (req, res) => {
  //TODO: handle update a tour ...

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour...'
    }
  });
};

exports.deleteTour = (req, res) => {
  //TODO: handle update a tour ...

  res.status(204).json({
    status: 'success',
    data: null
  });
};
