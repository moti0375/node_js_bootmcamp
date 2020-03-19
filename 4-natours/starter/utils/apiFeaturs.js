const Tour = require('../models/tourModel.js');

class ApiFeaturs {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(field => delete queryObj[field]);
    // console.log(this.query);

    //2) Advanced filtering
    let qryString = JSON.stringify(queryObj);
    qryString = qryString.replace(/\bgte|gt|lte|lt\b/g, match => {
      console.log(`matched ${match}`);
      return `$${match}`;
    });

    qryString = qryString.replace('.', () => {
      ' ';
    });

    // console.log(`Filtered queryString: ${queryString}`);
    const filteredQuery = JSON.parse(qryString);
    console.log(filteredQuery);
    // {difficulty: 'easy', duration: {$gte : 5}}
    // const toues = await Tour.find(queryObj); //This will run the mongoose query without keeping the query obj for later
    this.query.find(filteredQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortStr = this.queryString.sort.split('.').join(' ');
      console.log(`Sort query: ${sortStr}`);
      this.query = this.query.sort(sortStr);
    } else {
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split('.').join(' ');
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //If no fields specified, remove this field which is created by mongoose (minus means remove this field)
    }
    return this;
  }

  async paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(`Page ${this.queryString.page}, Limit: ${this.queryString.limit}`);

    this.query = this.query.skip(skip).limit(limit);

    if (this.queryString.page) {
      const count = await Tour.countDocuments();
      console.log(`Document count: ${count}, Skip: ${skip}`);
      if (skip >= count) {
        throw new Error('Page not exists');
      }
    }
    return this;
  }
}

module.exports = ApiFeaturs;
