const handlerFactory = require('./handlerFactoryController');
const { createUpload } = require('../config/cloudinary');
const User = require('../models/User');
const Shipment = require('../models/Shipment');
const SubShipment = require('../models/SubShipment');
const { selectAllAttributesExcept } = require('../utils/dbUtils')
const { USER_ATTR, FRAMEWORK_ATTR,
  ASSOCIATION_ALIASES: { USER_ASSOCIATIONS } } = require('../constants/modelConstants')
const { MIDDLEWARES_KEYS } = require('../constants/appConstants')
const catchAsync = require('../utils/catchAsync')
const responseHandler = require('../responseHandlers/responseHandler')
const { ArgumentsValidationError } = require('../utils/errorTypes')

const { queryParamsMiddlewareFactory, cloneFindOptions, generateIndexMap } = require('../middlewares/queryParamsMiddlewareFactory')

const { Op } = require('sequelize');

const findOptions = {
  include: [
    // { model : WorkingPosition, as : USER_ASSOCIATIONS.WORKING_POSITION },
    // { model : CompanyBranch, as : USER_ASSOCIATIONS.COMPANY_BRANCH },
    // { model : CompanyLine, as : USER_ASSOCIATIONS.COMPANY_LINE }
  ],
}

const dynamicQueryOptionsTemplate = cloneFindOptions(findOptions);
const indexMap = generateIndexMap(dynamicQueryOptionsTemplate, 'User');

const dynamicQueryParamsMiddleware = queryParamsMiddlewareFactory(User, dynamicQueryOptionsTemplate, indexMap);

const upload = createUpload('images');

async function checkEmailExists(req, res, next) {
  try {
    let exists = !! await User.findOne({
      where: {
        email: req.query.email
      }
    });
    return res.status(200).json({ exists });
    //return responseHandler(req, res, 200, { exists });
  } catch (error) {
    next(error);
  }
}






async function uploadFile(req, res, next) {
  res.json({
    status: 'success',
    path: req.file.path,
  });
};


async function validateEmailUnique(email, userId, transaction) {
  //console.log("User id ", userId);
  let foundClient = await User.findOne({
    where: {
      [USER_ATTR.EMAIL]: email,
      "deleted_at": null
    },
    transaction
  });

  if (foundClient && (foundClient[USER_ATTR.USER_ID] !== userId)) throw new ArgumentsValidationError("Email already exists")

  return false;
}

function checkEmailExistsMiddlewareFactory(useTransaction) {
  return async function (req, res, next) {
    let t = req[MIDDLEWARES_KEYS.REQ.TRANSACTION];
    let userId = req.params['id'];
    userId = userId == null ? userId : Number(userId)
    try {
      if (t == null && useTransaction) {
        t = await User.sequelize.transaction();
      }
      if (!(USER_ATTR.EMAIL in req.body)) return next();
      await validateEmailUnique(req.body[USER_ATTR.EMAIL], userId, useTransaction ? t : undefined);
      next();
    } catch (error) {
      next(error)
    }
  }
}


async function checkUserInUse(req, res, next) {
  try {
    const userId = req.params.id;
    const [shipmentCount, subShipmentEmployeeCount, subShipmentClientCount] = await Promise.all([
      Shipment.count({ where: { employee_id: userId } }),
      SubShipment.count({ where: { employee_id: userId } }),
      SubShipment.count({ where: { client_id: userId } }),
    ]);
    const total = shipmentCount + subShipmentEmployeeCount + subShipmentClientCount;
    if (total > 0)
      return next(new ArgumentsValidationError(
        `Cannot delete user — they are referenced by ${total} shipment/sub-shipment record(s).`
      ));
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll: [handlerFactory.getAll(User, findOptions)],
  getOne: handlerFactory.getOne(User, findOptions),
  createOneExcludeAttributes: [checkEmailExistsMiddlewareFactory(false), handlerFactory.createOneExcludeAttributes(User, [USER_ATTR.PASSWORD, FRAMEWORK_ATTR.CREATED_AT, FRAMEWORK_ATTR.UPDATED_AT])],
  deleteOne: [checkUserInUse, handlerFactory.deleteOne(User)],
  updateOne: [
    checkEmailExistsMiddlewareFactory(false),
    handlerFactory.updateOne(User)],
  checkEmailExists,
  uploadFile,
  upload
}