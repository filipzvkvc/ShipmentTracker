const { SHIPMENT_STATUS_ATTR } = require('../constants/modelConstants');

module.exports = [
    {
        [SHIPMENT_STATUS_ATTR.ID]: 1,
        [SHIPMENT_STATUS_ATTR.STATUS]: "PREPARING"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 2,
        [SHIPMENT_STATUS_ATTR.STATUS]: "DEPARTED"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 3,
        [SHIPMENT_STATUS_ATTR.STATUS]: "ARRIVED"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 4,
        [SHIPMENT_STATUS_ATTR.STATUS]: "CANCELED"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 5,
        [SHIPMENT_STATUS_ATTR.STATUS]: "DELAYED"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 6,
        [SHIPMENT_STATUS_ATTR.STATUS]: "DELIVERED"
    },

]