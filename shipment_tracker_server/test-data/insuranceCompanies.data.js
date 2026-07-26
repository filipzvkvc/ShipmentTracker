const { INSURANCE_COMP_ATTR } = require('../constants/modelConstants')

module.exports = [
  {
    [INSURANCE_COMP_ATTR.INSURANCE_COMPANY_ID] : 1,
    [INSURANCE_COMP_ATTR.NAME] : "Danube Insurance",
    [INSURANCE_COMP_ATTR.TOWN] : "Novi Sad",
    [INSURANCE_COMP_ATTR.ADDRESS] : "Liberation Boulevard 3",
    [INSURANCE_COMP_ATTR.LANDING_PHONE] : "0216736736",
    [INSURANCE_COMP_ATTR.EMAIL] : "info@dunav.com"
  },
  {
    [INSURANCE_COMP_ATTR.INSURANCE_COMPANY_ID] : 2,
    [INSURANCE_COMP_ATTR.NAME] : "DDOR Insurance",
    [INSURANCE_COMP_ATTR.TOWN] : "Novi Sad",
    [INSURANCE_COMP_ATTR.ADDRESS] : "Zeleznicka 5",
    [INSURANCE_COMP_ATTR.LANDING_PHONE] : "0800303301",
    [INSURANCE_COMP_ATTR.EMAIL] : "dpo@ddor.co.rs"
  },
];