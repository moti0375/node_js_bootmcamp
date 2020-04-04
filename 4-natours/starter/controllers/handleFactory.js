const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeaturs = require('../utils/apiFeaturs');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true //The validators will run again when updating a document
    });

    if (!document) {
      return next(new AppError(`Cannot find document with this id: ${req.params.id}`), 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    if (!document) {
      return next(new AppError(`Cannot create document`), 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    // const ture = await Tour.findOne({ _id: req.params.id });  same as findById

    console.log(`getTour: ${doc}`);
    if (!doc) {
      return next(new AppError(`Cannot find such document with this id: ${req.params.id}`), 404);
    }

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: 1,
      data: {
        doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //To GET reviews for a tour
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }
    //Execute the query
    const features = await new ApiFeaturs(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query.explain();

    //Sending the response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        docs
      }
    });
  });
