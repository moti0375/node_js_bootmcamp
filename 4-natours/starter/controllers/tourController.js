const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);
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
  // console.log(req.requestTime);
  const id = req.params.id * 1;
  const tour = tours.find(tour => tour.id === id);
  // console.log(tour);

  if (tour === undefined) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID'
    });
  }

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

  console.log('Update tour: ' + req.params.id);
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (tour === undefined) {
    return res.status(401).json({
      status: 'Failed',
      message: 'Tour not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour...'
    }
  });
};

exports.deleteTour = (req, res) => {
  //TODO: handle update a tour ...

  console.log('Delete tour: ' + req.params.id);
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  if (tour === undefined) {
    return res.status(401).json({
      status: 'Failed',
      message: 'Tour not found'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};
