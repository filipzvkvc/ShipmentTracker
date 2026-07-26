const ENV_TYPES = {
  DEVELOPMENT : "development",
  STAGING : "staging",
  PRODUCTIOTN : "production",
  TEST : "test"
}

const USER_TYPES = {
  EMPLOYEE : 1,
  ADMIN : 2,
  CLIENT : 3,
}

const CLIENT_TYPES = {
  PHYSICAL_PERSON : 1,
  LEGAL_PERSON : 2
}

const MIDDLEWARES_KEYS = {
  REQ : {
    TRANSACTION : "transaction",
    AUTH_DATA : "authData"
  }, 
  RES : {
    RESPONSE_OBJECT : "responseObject"    
  }
}

const STATISTICS_QUERY_KEYS = {
  START : "start",
  END : "end",
  RESOLUTION : "resolution",
  MODEL : "model",
  BRANCHES : "branches",
  LINES : "lines",
  INSURANCE_COMPANIES : "insurance_companies",
  CLIENT_TYPES : "client_types",
  REVENUE_TYPE : "revenue_type"
}

const STATISTICS_RESPONSE_KEYS = {
  DATA : "data",    //array of arrays,
  RESOLUTION : "resolution",
  PERIODS : "periods" //array of arrays
}

const STATISTICS_RESOLUTION_TYPES = {
  DAYS : "days",
  WEEKS : "weeks",
  MONTHS : "months",
  YEARS : "years"  
}

const STATISTICS_REVENUE_TYPES = {
  ALL : "all",
  INSURANCE : "insurance",
  SERVICE : "service"
}

const STATISTICS_MODEL_TYPES = {
  REGISTRATIONS : "registrations",
  REVENUE : "revenue",
  CLIENTS : "clients",
  INSURANCE : "insurance",  
}

const STATISTICS_MODEL_TYPES_NUMBERS = {
  REGISTRATIONS : 1,
  REVENUE_ALL : 2,
  CLIENTS : 3,
  INSURANCE : 4,  
  REVENUE_INSURANCE : 5,
  REVENUE_SERVICE : 6,
}

const REGISTRATION_STATISTICS_QUERY_KEYS = {
  START : "start",
  END : "end",  
  BRANCHES : "branches",
  LINES : "lines",
  INSURANCE_COMPANIES : "insurance_companies",
  CLIENT_TYPES : "client_types",  
  VEHICLE_TYPES : "vehicle_types",
  REGISTRATION_EXP_BEFORE : "registration_exp_before",
}

/** @type { STATISTICS_REVENUE_TYPES } */
const STATISTICS_PRICE_TYPES = {
  ...STATISTICS_REVENUE_TYPES
}



module.exports = {
  ENV_TYPES,
  USER_TYPES,
  CLIENT_TYPES,
  MIDDLEWARES_KEYS,
  STATS_QUERY_KEYS : STATISTICS_QUERY_KEYS,
  STATS_RES_KEYS : STATISTICS_RESPONSE_KEYS,
  STATS_RESOLUTION_TYPES : STATISTICS_RESOLUTION_TYPES,
  STATS_MODEL_TYPES : STATISTICS_MODEL_TYPES,
  STATS_MODEL_TYPES_NUMBERS : STATISTICS_MODEL_TYPES_NUMBERS,
  STATS_REVENU_TYPES : STATISTICS_REVENUE_TYPES,  
  REG_STATS_QUERY_KEYS : REGISTRATION_STATISTICS_QUERY_KEYS,
  STATS_PRICE_TYPES : STATISTICS_PRICE_TYPES
}