const { USER_AD_ATR, USER_ATTR } = require('../constants/modelConstants')
const User = require('../models/User');
const { AuthenticationError, ServerError } = require('../utils/errorTypes')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
    try {
        console.log(req.name);
        next();
    } catch (error) {
        next(new ServerError(null, error))
    }
}