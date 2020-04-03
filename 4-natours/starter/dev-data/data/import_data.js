const dotenv = require('dotenv');

dotenv.config('../../.env');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// console.log(DB);

const DB =
  'mongodb+srv://natours-remote-db:uORaJ5YvcPFsComh@natours-app-course-rpoqx.mongodb.net/natours?retryWrites=true&w=majority';

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));

// console.log(tours);

const saveTours = async t =>
  await Tour.create(t).then(result => {
    console.log('Tours saved to db');
    console.log(result);
    process.exit();
  });

const deleteTours = async () => {
  await Tour.deleteMany().then(result => {
    console.log('Tours deleted');
    process.exit();
  });
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
        saveTours(tours);
      } else if (process.argv[2] === '--delete') {
        deleteTours();
      } else {
        console.log('Nothing done..');
      }
    } catch (err) {
      console.log(err);
    }
  });
