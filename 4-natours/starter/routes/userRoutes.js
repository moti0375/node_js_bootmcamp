const express = require('express');
const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

//Users
const getAllUsers = (req, res) => {
  // console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
};

const getUser = (req, res) => {
  const id = req.params.id;
  console.log(`${id}`);

  const user = users.find(el => el._id === id);
  // console.log(tour);

  if (user === undefined) {
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
      user
    }
  });
};

const createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser
        }
      });
    }
  );
};

const updateUser = (req, res) => {
  //TODO: handle update a tour ...

  console.log('Update tour: ' + req.params.id);
  const id = req.params.id * 1;
  const user = users.find(el => el.id === id);

  if (tour === undefined) {
    return res.status(401).json({
      status: 'Failed',
      message: 'Tour not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: 'Updated tour...'
    }
  });
};

const deleteUser = (req, res) => {
  //TODO: handle update a tour ...

  console.log('Delete user: ' + req.params.id);
  const id = req.params.id * 1;
  const user = users.find(el => el.id === id);

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

const router = express.Router();
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
