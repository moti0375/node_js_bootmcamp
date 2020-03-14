const fs = require('fs');

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

//Users
exports.getAllUsers = (req, res) => {
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

exports.checkId = (req, res, next, val) => {
  const user = users.find(el => el._id === val);
  // console.log(tour);

  if (user === undefined) {
    console.log(`User ${val} invalid, userMiddleware`);

    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  console.log(`${id}`);

  const user = users.find(el => el._id === id);
  // console.log(tour);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: 1,
    data: {
      user
    }
  });
};

exports.createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newUser = { id: newId, ...req.body };
  users.push(newUser);
  fs.writeFile(`${__dirname}/dev-data/data/users.json`, JSON.stringify(users), () => {
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  });
};

exports.updateUser = (req, res) => {
  //TODO: handle update a tour ...

  console.log(`Update user: ${req.params.id}`);

  res.status(200).json({
    status: 'success',
    data: {
      user: 'Updated tour...'
    }
  });
};

exports.deleteUser = (req, res) => {
  //TODO: handle update a tour ...

  console.log(`Delete user: ${req.params.id}`);

  res.status(204).json({
    status: 'success',
    data: null
  });
};
