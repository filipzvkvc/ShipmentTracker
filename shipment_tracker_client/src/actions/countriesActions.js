import { remoteGetAllCountries, remoteCreateCountry, remoteUpdateCountry, remoteDeleteCountry } from '../data-source/countriesDataSource';
import { unknownErrorThanActionHandlerFactory } from '../services/utils';
import { showMessage } from './messageActions';
import MESSAGE_TYPES from '../constants/messagesTypes';
import ACTIONS from '../constants/actionTypes';

export function fetchCountries() {
  return async function (dispatch) {
    try {
      const data = await remoteGetAllCountries();
      dispatch({ type: ACTIONS.COUNTRIES.SET_ALL, payload: data });
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function createCountry(name) {
  return async function (dispatch) {
    try {
      const result = await remoteCreateCountry(name);
      dispatch(showMessage('Country created', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.COUNTRIES.ADD, payload: result });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function updateCountry(id, name) {
  return async function (dispatch) {
    try {
      const result = await remoteUpdateCountry(id, name);
      dispatch(showMessage('Country updated', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.COUNTRIES.UPDATE, payload: result });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function deleteCountry(id) {
  return async function (dispatch) {
    try {
      await remoteDeleteCountry(id);
      dispatch(showMessage('Country deleted', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.COUNTRIES.REMOVE, payload: id });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}
