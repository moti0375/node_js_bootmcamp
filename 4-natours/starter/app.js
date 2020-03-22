const express = require('express');

const app = express();
const morgan = require('morgan');
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

// 1) Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //Logging middleware
}
app.use(express.json()); //Middleware modify incoming data to json format
app.use(express.static(`${__dirname}/public`)); //static files middleware
app.use((req, res, next) => {
  //A custom middleware
  // console.log('A request has been received, middleware 😇');
  next();
});

app.use((req, res, next) => {
  //Add timestamp middleware
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes handlers
// app.get('/', (req, res) => {
//   res.status(404).json({ message: 'Hello from the server!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('Hello from the server post!');
// });

// app.get('/api/v1/tours', getAllTours); //old version..
// app.post('/api/v1/tours', createTour); //old version..

// app.get('/api/v1/tours/:id/:x?', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
app.use('/api/v1/users', usersRouter); //UsersRouter middleware
app.use('/api/v1/tours', toursRouter); //ToursRouter middleware

//This is the last route which means there was an error to analyze the req url, a generic error handler
app.all('*', (req, res, next) => {
  // const error = new Error(`Can't find ${req.url} on this server!`);
  // error.statusCode = 404;
  // error.status = 'fail';

  const error = new AppError(`Can't find ${req.url} on this server!`, 404);
  next(error);
});

app.use(errorHandler);
module.exports = app;
