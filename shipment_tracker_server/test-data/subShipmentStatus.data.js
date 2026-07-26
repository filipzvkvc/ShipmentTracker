const { SHIPMENT_STATUS_ATTR } = require('../constants/modelConstants');

module.exports = [
    {
        [SHIPMENT_STATUS_ATTR.ID]: 1,
        [SHIPMENT_STATUS_ATTR.STATUS]: "INAIR"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 2,
        [SHIPMENT_STATUS_ATTR.STATUS]: "LANDED"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 3,
        [SHIPMENT_STATUS_ATTR.STATUS]: "ONTHEWAY"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 4,
        [SHIPMENT_STATUS_ATTR.STATUS]: "DELIVERED"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 5,
        [SHIPMENT_STATUS_ATTR.STATUS]: "CANCELED"
    },
    {
        [SHIPMENT_STATUS_ATTR.ID]: 6,
        [SHIPMENT_STATUS_ATTR.STATUS]: "DELAYED"
    },

]