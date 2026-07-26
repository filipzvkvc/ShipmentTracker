const { PAYMENT_TYPE_ATTR } = require('../constants/modelConstants');

module.exports = [
  {
    [PAYMENT_TYPE_ATTR.PAYMENT_TYPE_ID] : 1,
    [PAYMENT_TYPE_ATTR.NAME] : "Cash",
    [PAYMENT_TYPE_ATTR.DESCRIPTION] : "Cash payment, no installments"
  },
  {
    [PAYMENT_TYPE_ATTR.PAYMENT_TYPE_ID] : 2,
    [PAYMENT_TYPE_ATTR.NAME] : "Cash, with installments",
    [PAYMENT_TYPE_ATTR.DESCRIPTION] : "Cash payment, in 12 installments"
  },
  {
    [PAYMENT_TYPE_ATTR.PAYMENT_TYPE_ID] : 3,
    [PAYMENT_TYPE_ATTR.NAME] : "Bank transfer",
    [PAYMENT_TYPE_ATTR.DESCRIPTION] : "Payment via bank account"
  },
  {
    [PAYMENT_TYPE_ATTR.PAYMENT_TYPE_ID] : 4,
    [PAYMENT_TYPE_ATTR.NAME] : "Bank transfer, with installments",
    [PAYMENT_TYPE_ATTR.DESCRIPTION] : "Payment via bank account, in 12 installments"
  },
  {
    [PAYMENT_TYPE_ATTR.PAYMENT_TYPE_ID] : 5,
    [PAYMENT_TYPE_ATTR.NAME] : "Deferred",
    [PAYMENT_TYPE_ATTR.DESCRIPTION] : "Deferred payment (informal IOU)"
  },
];