const dotenv = require('dotenv');

dotenv.config('../../.env');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// console.log(DB);

const DB =
  'mongodb+srv://natours-remote-db:uORaJ5YvcPFsComh@natours-app-course-rpoqx.mongodb.net/natours?retryWrites=true&w=majority';

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));

// console.log(tours);

const saveData = async () => {
  // await Tour.create(tours);
  // await User.create(users, { validateBeforeSave: false });
  await Review.create(reviews, { validateBeforeSave: false });
  process.exit();
};

const deleteMany = async () => {
  await Tour.deleteMany();
  await User.deleteMany();
  await Review.deleteMany();
  process.exit();
};

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    try {
      if (process.argv[2] === '--import') {
        saveData();
      } else if (process.argv[2] === '--delete') {
        deleteMany();
      } else {
        console.log('Nothing done..');
      }
    } catch (err) {
      console.log(err);
    }
  });
