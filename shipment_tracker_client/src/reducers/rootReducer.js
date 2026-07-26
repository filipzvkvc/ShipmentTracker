import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import authReducer from './authReducer';
import eventsReducer from './eventsReducer';
import shipmentsReducer from './shipmentsReducer';
import subShipmentsReducer from './subShipmentsReducer';
import usersReducer from './usersReducer';
import countriesReducer from './countriesReducer';
import itemTypesReducer from './itemTypesReducer';

const rootReducer = combineReducers({
  message: messageReducer,
  auth: authReducer,
  events: eventsReducer,
  shipments: shipmentsReducer,
  subShipments: subShipmentsReducer,
  users: usersReducer,
  countries: countriesReducer,
  itemTypes: itemTypesReducer,
});

export default rootReducer;
