const Enum = require('enum');

Enum.register();

const SHIPMENTSTATUS = new Enum([
  'PREPARING',
  'DEPARTED',
  'ARRIVED',
  'CANCELED',
  'DELAYED',
  'DELIVERED'
], { ignoreCase: true })


const MODELS_NAMES = {
  USER: "user",
  ITEM_TYPE: "item_type",
  COUNTRY: "country",
  SHIPMENT: "shipment",
  CARGO_TO_ITEM_TYPE: "CargoToItemType",
  SHIPMENT_STATUS: "ShipmentStatus",
  CARGO: "cargo",
  SUB_SHIPMENT: "subShipment",
  SHIPMENT_TO_SHIPMENT: "shipmentToShipment",
  PASSWORD_RESET_REQUEST: "password_reset_request"
}

const ATTRIBUTES_NAMES = {
  USER: {
    USER_ID: "user_id",
    FULL_NAME: "full_name",
    EMAIL: "email",
    PASSWORD: "password",
    USER_TYPE: "user_type",
    CELL_PHONE: "cell_phone",
    LANDING_PHONE: "landing_phone",
    PICTURE_PATH: "picture_path",
    WORKING_POSITION_ID_FK: "working_position_id_fk",
    COMPANY_BRANCH_ID_FK: "company_branch_id_fk",
    COMPANY_LINE_ID_FK: "company_line_id_fk",
    ACTIVE: "active",
  },
  CARGO_TO_ITEM_TYPE: {
    ID: "id",
    CARGO_ID: "cargo_id",
    ITEM_TYPE_ID: "item_type_id",
    DESCRIPTION: "description"
  },
  CARGO: {
    ID: "id",
    QUANTITY: "quantity"
  },
  ITEM_TYPE: {
    ID: "id",
    NAME: "name",
    NUMBER_OF_SOLD_ITEMS: "number_of_sold_items"
  },
  COUNTRY: {
    ID: "id",
    NAME: "name"
  },
  SHIPMENT: {
    ID: "id",
    DEPARTURE_DATE: "departureDate",
    ARRIVAL_DATE: "arrivalDate",
    ARRIVAL_PLACE: "arrivalPlace",
    RETURNING_DATE: "returningDate",
    RETURNING_PLACE: "returningPlace",
    TICKET_PRICE: "ticketPrice",
    CARGO_TICKET_PRICE: "cargoTicketPrice",
    COMMENT: "comment",

  }, SHIPMENT_STATUS: {
    ID: "id",
    STATUS: "status"
  },
  SUB_SHIPMENT: {
    ID: 'id',
    SUB_SHIPMENT_PLACE: 'subShipmentPlace',
    DELIVERY_DATE: 'deliveryDate',
    COMMENT: 'comment',
    PROOF: 'proof'
  },
  PASSWORD_RESET_REQUEST: {
    PASSWORD_RESET_REQUEST_ID: "password_reset_request_id",
    TOKEN: "token"
  }
}

const FRAMEWORK_ATTR = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  ID: "id"
}

const ADDITIONAL_ATTRIBUTES = {
  USER: {
    OLD_PASSWORD: "old_password",
    NEW_PASSWORD: "new_password"
  },
  PASSWORD_RESET: {
    NEW_PASSWORD: "new_password",
    NEW_AGAIN_PASSWORD: "new_again_password"
  }
}

const ASSOCIATION_ALIASES = {
  USER_ASSOCIATIONS: {
    // WORKING_POSITION : "WorkingPosition",
    // COMPANY_BRANCH : "CompanyBranch",
    // COMPANY_LINE : "CompanyLine"
  },
}

const MIDDLEWARES_ATTRIBUTES = {
  AUTH: {
    TOKEN: "token",
    AUTH_DATA: "authData",
    RESET_PASSWORD_TOKEN: "reset_password_token"
  }
}

module.exports = {
  MODELS_NAMES,
  ATTRIBUTES_NAMES,
  ADDITIONAL_ATTRIBUTES,
  ITEM_TYPE_ATTR: ATTRIBUTES_NAMES.ITEM_TYPE,
  CAR_GO_ATTR: ATTRIBUTES_NAMES.CARGO,
  CARGO_TO_ITEM_TYPE_ATTR: ATTRIBUTES_NAMES.CARGO_TO_ITEM_TYPE,
  SHIPMENT_STATUS_ATTR: ATTRIBUTES_NAMES.SHIPMENT_STATUS,
  COUNTRY_ATTR: ATTRIBUTES_NAMES.COUNTRY,
  SHIPMENT_ATTR: ATTRIBUTES_NAMES.SHIPMENT,
  SUB_SHIPMENT_ATTR: ATTRIBUTES_NAMES.SUB_SHIPMENT,
  USER_ATTR: ATTRIBUTES_NAMES.USER,
  WORKING_POS_ATTR: ATTRIBUTES_NAMES.WORKING_POSITION,
  COMP_BRANCH_ATTR: ATTRIBUTES_NAMES.COMPANY_BRANCH,
  COMP_LINE_ATTR: ATTRIBUTES_NAMES.COMPANY_LINE,
  CLIENT_ATTR: ATTRIBUTES_NAMES.CLIENT,
  PHYSICAL_PERSON_ATTR: ATTRIBUTES_NAMES.PHYSICAL_PERSON,
  LEGAL_PERSON_ATTR: ATTRIBUTES_NAMES.LEGAL_PERSON,
  REG_ATTR: ATTRIBUTES_NAMES.REGISTRATION,
  VEHICLE_TYPE_ATTR: ATTRIBUTES_NAMES.VEHICLE_TYPE,
  PAYMENT_TYPE_ATTR: ATTRIBUTES_NAMES.PAYMENT_TYPE,
  INSURANCE_COMP_ATTR: ATTRIBUTES_NAMES.INSURANCE_COMPANY,
  EMPLOYEE_ATTR: ATTRIBUTES_NAMES.EMPLOYEE,
  PASSWORD_RESET_REQ_ATTR: ATTRIBUTES_NAMES.PASSWORD_RESET_REQUEST,

  FRAMEWORK_ATTR,
  USER_AD_ATR: ADDITIONAL_ATTRIBUTES.USER,
  PASSWORD_RESET_AD_ATTR: ADDITIONAL_ATTRIBUTES.PASSWORD_RESET,

  ASSOCIATION_ALIASES,
  MIDDLEWARES_ATTRIBUTES
}