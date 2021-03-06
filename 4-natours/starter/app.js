const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const morgan = require('morgan');
const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRouter');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); //Setting the views path
app.use(express.static(path.join(__dirname, 'public'))); //static files middleware

// 1) Global Middlewares
//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //Logging middleware
}
//Security http headers
app.use(helmet()); //

//Security query rate limit from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //One hour
  message: 'Too many requests are not allowed please try again in 1 hour'
});
app.use('/api', limiter);

//Body parser
app.use(express.json({ limit: '10kb' })); //Middleware modify incoming data to json format, limit to less than 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //Middleware modify incoming data to from html FORM

//Cookie parser
app.use(cookieParser());

//Sanitizing data against NoSQL query inject attack
app.use(mongoSanitize());

//Sanitizing data against XXS attack
app.use(xss());

//Prevent params polution
app.use(
  hpp({
    whitelist: ['duration', 'difficulty', 'ratingsAverage', 'ratingsQuantity', 'difficulty', 'maxGroupSize', 'price']
  })
);

//Test middleware
app.use((req, res, next) => {
  //A custom middleware
  // console.log('A request has been received, middleware 😇');
  console.log(req.cookies);
  next();
});

app.use((req, res, next) => {
  //Add timestamp middleware
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes handlers
//View routes moved to view router
// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'Eilat Israel',
//     user: 'Moti Bartov'
//   });
// });

// app.get('/overview', (req, res) => {
//   res.status(200).render('overview', {
//     title: 'All Tours'
//   });
// });

// app.get('/tour', (req, res) => {
//   res.status(200).render('tour', {
//     title: 'Forest Hiker'
//   });
// });

app.use('/', viewRouter); //ViewsRouter middleware
app.use('/api/v1/users', usersRouter); //UsersRouter middleware
app.use('/api/v1/tours', toursRouter); //ToursRouter middleware
app.use('/api/v1/reviews', reviewRouter); //Review middleware

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
