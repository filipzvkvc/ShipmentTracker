const SubShipment = require('../models/SubShipment');
const Shipment = require('../models/Shipment');
const Cargo = require('../models/Cargo');
const ItemType = require('../models/ItemType');
const User = require('../models/User');
const factory = require('./handlerFactoryController');
const sequelize = require('sequelize');
const CargoToItemType = require('../models/CargoToItemType');
const SubShipmentStatus = require('../models/SubShipmentStatus');
const Op = sequelize.Op;

const { createUpload, cloudinary } = require('../config/cloudinary');
const { ArgumentsValidationError } = require('../utils/errorTypes');

const SubShipmentIncludes = {
  include: [
    { model: User, as: 'employee' },
    { model: User, as: 'client' },
    {
      model: Shipment, as: 'shipment', include: [
        {
          model: User, as: 'employee'
        },


      ]
    },
    {
      model: CargoToItemType, as: 'cargoToItemType', include: [
        {
          model: ItemType, as: 'itemType'
        },
        {
          model: Cargo, as: 'cargo'
        }
      ]
    },
    { model: SubShipmentStatus, as: 'subShipmentStatus' },
  ],
  attributes: {
    exclude: ['employee_id', 'client_id', 'shipment_id',
      'cargoToItemType_id', 'sub_shipment_status_id']
  },
};
const upload = createUpload('proofs');
async function uploadFile(req, res, next) {
  res.json({
    status: 'success',
    path: req.file.path,
  });
};
async function getUsersSubShipments(req, res, next) {
  const userId = req.params.userId;
  let result = null;
  const status = req.query.status ? req.query.status : '-1';
  try {
    if (status !== '-1') {
      result = await SubShipment.findAll({
        where: {
          [Op.or]: [
            { '$shipment.employee_id$': userId },
            {
              employee_id: userId
            },
            {
              client_id: userId
            }

          ],
          sub_shipment_status_id: status

        }, ...SubShipmentIncludes
      })
    }

    else {
      result = await SubShipment.findAll({
        where: {
          [Op.or]: [
            { '$shipment.employee_id$': userId },
            {
              employee_id: userId
            },
            {
              client_id: userId
            }

          ],


        },
        ...SubShipmentIncludes
      })
    }

    return res.status(200).json(result)
  }
  catch (error) {
    next(error);
  }
}
async function updateSubShipmentStatus(req, res, next) {
  const subShipmentId = req.params.subShipmentId;
  const statusId = req.params.statusId;
  try {
    const [status, ss] = await Promise.all([
      SubShipmentStatus.findOne({ where: { id: statusId } }),
      SubShipment.findOne({ where: { id: subShipmentId } }),
    ]);
    if (status?.status === 'DELIVERED' && !ss?.proof) {
      return next(new ArgumentsValidationError('Cannot set status to DELIVERED — no proof uploaded.'));
    }
    const updateFields = { sub_shipment_status_id: statusId };
    if (status?.status === 'DELIVERED' && !ss?.deliveryDate) {
      updateFields.deliveryDate = new Date();
    }
    const result = await SubShipment.update(updateFields, { where: { id: subShipmentId } });
    return res.status(200).json(result);
  }
  catch (error) {
    next(error);
  }
}
async function updateSubShipmentProof(req, res, next) {
  const subShipmentId = req.params.subShipmentId;
  const path = req.body.path;
  try {
    const [deliveredSubStatus, ss] = await Promise.all([
      SubShipmentStatus.findOne({ where: { status: 'DELIVERED' } }),
      SubShipment.findOne({ where: { id: subShipmentId } }),
    ]);

    if (!path && ss?.proof) {
      const parts = ss.proof.split('/upload/');
      if (parts.length > 1) {
        const publicId = parts[1].replace(/^v\d+\//, '').replace(/\.[^.]+$/, '');
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
    }

    const updateFields = { proof: path };
    if (path && deliveredSubStatus) {
      updateFields.sub_shipment_status_id = deliveredSubStatus.id;
      if (!ss?.deliveryDate) updateFields.deliveryDate = new Date();
    } else if (!path) {
      const onTheWayStatus = await SubShipmentStatus.findOne({ where: { status: 'ONTHEWAY' } });
      updateFields.sub_shipment_status_id = onTheWayStatus?.id || null;
    }

    await SubShipment.update(updateFields, { where: { id: subShipmentId } });
    return res.status(200).json({ status: 'success' });
  }
  catch (error) {
    next(error);
  }
}

async function createSubShipment(req, res, next) {
  const quantity = req.params.quantity;
  const itemType = req.body.itemType;
  const subShipment = req.body.subShipment;
  try {
    const CargoId = await Cargo.create({ quantity: quantity }).then(
      (res) => res.dataValues.id
    );

    const cargoToitemTypeId = await CargoToItemType.create({
      cargo_id: CargoId,
      item_type_id: itemType.id,
      description: itemType.description,
    }).then((res) => res.dataValues.id);

    await ItemType.increment('number_of_sold_items', {
      by: Number(quantity),
      where: { id: itemType.id },
    });

    const createdSubShipment = await SubShipment.create({
      ...subShipment,
      cargoToItemType_id: cargoToitemTypeId,
    });

    return res.status(200).json(createdSubShipment);
  } catch (error) {
    next(error);
  }
}

async function getSubShipmentsFromShipment(req, res, next) {
  const shipmentId = req.params.shipmentId;
  try {
    const subShipments = await SubShipment.findAll({
      where: { shipment_id: shipmentId },
      ...SubShipmentIncludes,
    });

    const subShipmentsToView = subShipments.map(ss => ({
      id: ss.id,
      employee: ss.employee?.email || null,
      client: ss.client?.email || null,
      deliveryDate: ss.deliveryDate,
      subShipmentPlace: ss.subShipmentPlace,
      comment: ss.comment,
      proof: ss.proof,
      quantity: ss.cargoToItemType?.cargo?.quantity ?? 0,
      itemType: ss.cargoToItemType?.itemType?.name ?? '',
      commentForItemType: ss.cargoToItemType?.description ?? '',
      status: ss.subShipmentStatus?.status || null,
    }));

    return res.status(200).json(subShipmentsToView);
  } catch (error) {
    next(error);
  }
}

async function updateSubShipment(req, res, next) {
  try {
    const employee = await User.findOne({
      where: { email: req.body.employee },
    });
    const client = await User.findOne({
      where: { email: req.body.client },
    });
    const subShipment = await SubShipment.findOne({
      where: { id: req.params.id },
    });
    const cargoToItemType = await CargoToItemType.findOne({
      where: { id: subShipment.cargoToItemType_id },
    });
    const cargo = await Cargo.findOne({
      where: { id: cargoToItemType.cargo_id },
    });
    const itemType = await ItemType.findOne({
      where: { name: req.body.itemType },
    });
    const subShipmentStatusRecord = await SubShipmentStatus.findOne({
      where: { status: req.body.subShipmentStatus },
    });
    const subShipmentStatusId = subShipmentStatusRecord?.id || null;

    await CargoToItemType.update(
      {
        description: req.body.commentForItemType,
        item_type_id: itemType.id,
      },
      { where: { id: subShipment.cargoToItemType_id } }
    );

    await Cargo.update(
      {
        quantity: req.body.quantity,
      },
      { where: { id: cargo.id } }
    );

    const proofValue = req.body.proof || null;
    const proofJustAdded = proofValue && !subShipment.proof;
    const proofJustRemoved = !proofValue && subShipment.proof;

    if (proofJustRemoved) {
      const parts = subShipment.proof.split('/upload/');
      if (parts.length > 1) {
        const publicId = parts[1].replace(/^v\d+\//, '').replace(/\.[^.]+$/, '');
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
    }

    let finalStatusId = subShipmentStatusId;
    let finalStatusRecord = subShipmentStatusRecord;

    if (subShipmentStatusRecord?.status === 'DELIVERED' && !proofValue) {
      if (proofJustRemoved) {
        const onTheWayStatus = await SubShipmentStatus.findOne({ where: { status: 'ONTHEWAY' } });
        finalStatusId = onTheWayStatus?.id || null;
        finalStatusRecord = onTheWayStatus || null;
      } else {
        return next(new ArgumentsValidationError('Cannot set status to DELIVERED — no proof uploaded.'));
      }
    }

    if (proofJustAdded) {
      const deliveredStatus = await SubShipmentStatus.findOne({ where: { status: 'DELIVERED' } });
      if (deliveredStatus) {
        finalStatusId = deliveredStatus.id;
        finalStatusRecord = deliveredStatus;
      }
    }

    const updateFields = {
      subShipmentPlace: req.body.street,
      comment: req.body.comment,
      proof: proofValue,
      employee_id: employee.user_id,
      client_id: client.user_id,
      sub_shipment_status_id: finalStatusId,
    };
    if (finalStatusRecord?.status === 'DELIVERED' && !subShipment.deliveryDate) {
      updateFields.deliveryDate = new Date();
    }
    await SubShipment.update(updateFields, { where: { id: subShipment.id } });
    const updatedSubShipment = (await SubShipment.findOne({ where: { id: subShipment.id }, ...SubShipmentIncludes }));

    const subShipmentToView = {
      id: updatedSubShipment.id,
      employee: updatedSubShipment.employee.email,
      client: updatedSubShipment.client.email,
      deliveryDate: updatedSubShipment.deliveryDate,
      subShipmentPlace: updatedSubShipment.subShipmentPlace,
      comment: updatedSubShipment.comment,
      proof: updatedSubShipment.proof,
      quantity: (await Cargo.findOne({ where: { id: updatedSubShipment.cargoToItemType.cargo_id } })).quantity,
      itemType: (await ItemType.findOne({ where: { id: updatedSubShipment.cargoToItemType.item_type_id } })).name,
      commentForItemType: updatedSubShipment.cargoToItemType.description,
      status: updatedSubShipment.subShipmentStatus?.status || null,
    };

    return res.status(200).json(subShipmentToView);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll: factory.getAll(SubShipment, SubShipmentIncludes),
  getUsersSubShipments: getUsersSubShipments,
  updateSubShipmentStatus: updateSubShipmentStatus,
  getAllFromShipment: getSubShipmentsFromShipment,
  getOne: factory.getOne(SubShipment),
  create: createSubShipment,
  // updateOne: factory.updateOne(SubShipment),
  updateOne: updateSubShipment,
  deleteOne: async function (req, res, next) {
    try {
      const ss = await SubShipment.findOne({ where: { id: req.params.id }, include: [{ model: CargoToItemType, as: 'cargoToItemType', include: [{ model: Cargo, as: 'cargo' }] }] });
      if (!ss) return res.status(404).json({ message: 'Not found' });

      const cargoToItemType = ss.cargoToItemType;
      if (cargoToItemType) {
        const qty = cargoToItemType.cargo?.quantity || 0;
        await ItemType.decrement('number_of_sold_items', { by: qty, where: { id: cargoToItemType.item_type_id } });
        if (cargoToItemType.cargo) await cargoToItemType.cargo.destroy();
        await cargoToItemType.destroy();
      }

      await ss.destroy();
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  uploadFile,
  upload,
  updateSubShipmentProof
};
