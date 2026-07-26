const catchAsync = require('../utils/catchAsync');
const { BaseError, NoResultsError } = require('../utils/errorTypes');
const { DbError } = require('../utils/errorTypes');
const { MIDDLEWARES_KEYS: { REQ: REQ_MIDDLEWARE_KEYS, RES: RES_MIDDLEWARE_KEYS } } = require('../constants/appConstants')

const responseHandler = require('../responseHandlers/responseHandler');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id);
    if (!doc) {
      return next(new NoResultsError(404, 'No document found with that ID'));
    }

    await doc.destroy();

    responseHandler(req, res, 204, {
      status: 'success',
      data: null,
    });

  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.update(req.body, {
      where: { [Model.primaryKeyAttributes]: req.params.id },
    });

    const result = await Model.findByPk(req.params.id);

    responseHandler(req, res, 201, result);
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {

    const doc = await Model.create(req.body);

    responseHandler(req, res, 201, doc);
  });


exports.createOneWithTransaction = (Model) =>
  async (req, res, next) => {

    let doc = null;
    try {
      doc = await Model.create(req.body, { transaction: req[REQ_MIDDLEWARE_KEYS.TRANSACTION] });
    } catch (error) {

      return new DbError("Error during insertion into db: ", error);
    }

    responseHandler(req, res, 200, doc);
  };

exports.createOneAsMiddleware = (Model) =>
  async (req, res, next) => {

    let doc = null;
    try {
      res[RES_MIDDLEWARE_KEYS.RESPONSE_OBJECT] = await Model.create(req.body, { transaction: req[REQ_MIDDLEWARE_KEYS.TRANSACTION] });
      next();
    } catch (error) {
      return new DbError("Error during insertion into db: ", error);
    }
  };

exports.createOneExcludeAttributes = (Model, attributesArray) =>
  catchAsync(async (req, res, next) => {

    const doc = await Model.create(req.body);
    let responseResult = { ...doc.toJSON() }
    attributesArray.forEach(attr => delete responseResult[attr])

    responseHandler(req, res, 201, responseResult);
  });




exports.getOne = (Model, options) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id, options);

    if (!doc) return next(new NoResultsError(200, 'Not found !'));

    responseHandler(req, res, 200, doc);
  });

exports.getAll = (Model, includes) => async (req, res, next) => {
  console.log("table name", Model.getTableName())
  let result = await Model.findAll(includes);

  if (!result) return next(new NoResultsError(404, 'No results found.'));

  switch (Model.getTableName()) {
    case 'users': {
      if (req.query.userType)
        result = await Model.findAll({
          where: { user_type: Number(req.query.userType) },
          order: [
         
            ['full_name', 'ASC'],
          ],

        })
    }

  }


  responseHandler(req, res, 200, result);
};

exports.getOneStaticQuery = (Model, queryOptions) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne(queryOptions);

    if (!doc) return next(new NoResultsError(200, 'Not found !'));

    responseHandler(req, res, 200, doc);
  });


exports.getAllDynamicQuery = (Model) => async (req, res, next, queryOptions) => {
  try {

    const result = await Model.findAll(queryOptions);
    if (!result) return next(new NoResultsError(404, 'No results found.'));

    responseHandler(req, res, 200, result);


  } catch (error) {
    next(error);
  }
};

exports.checkExists = (Model, fieldName) => async (req, res, next) => {
  try {
    let exists = !! await Model.findOne({
      where: {
        [fieldName]: req.body[fieldName]
      }
    });

    return responseHandler(req, res, 200, { exists });
  } catch (error) {
    return next(error);
  }
}