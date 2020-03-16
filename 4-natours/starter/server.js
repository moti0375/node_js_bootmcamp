//Server
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
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
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price']
  },
  rating: {
    type: Number,
    required: [true, 'A Tour must have a rating']
  }
});

const Tour = mongoose.model('Tour', tourSchema);
