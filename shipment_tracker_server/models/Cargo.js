const { Model, DataTypes } = require('sequelize');
const { CAR_GO_ATTR, MODELS_NAMES } = require('../constants/modelConstants');
const db = require('../config/database');
class Cargo extends Model { }
Cargo.init(
    {
        [CAR_GO_ATTR.ID]: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        [CAR_GO_ATTR.QUANTITY]: {
            type: DataTypes.INTEGER
        },
    },
    {
        sequelize: db,
        modelName: MODELS_NAMES.CARGO,
        underscored: false,
        paranoid: true,
        createdAt: false,
        updatedAt: false
    }
)


module.exports = Cargo;
