//Server
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
let server;

const exitApplication = () => {
  console.log('Shtting down..');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', err => {
  console.log('UCOUGHT EXCEPTION 💥');
  console.log(`Uncought Exception was occurred: ${err.name}, ${err.message}`);
  exitApplication();
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// const LOCAL_DATA = process.env.DATABASE_LOCAL;
console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection established'));
const app = require('./app');

console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  //Catching error which not handled by express error handled by the express error handler middleware
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION 💥');
  exitApplication();
});
