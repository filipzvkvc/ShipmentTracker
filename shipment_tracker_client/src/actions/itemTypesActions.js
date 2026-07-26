import { remoteGetAllItemTypes, remoteCreateItemType, remoteUpdateItemType, remoteDeleteItemType } from '../data-source/itemTypesDataSource';
import { unknownErrorThanActionHandlerFactory } from '../services/utils';
import { showMessage } from './messageActions';
import MESSAGE_TYPES from '../constants/messagesTypes';
import ACTIONS from '../constants/actionTypes';

export function fetchItemTypes() {
  return async function (dispatch) {
    try {
      const data = await remoteGetAllItemTypes();
      dispatch({ type: ACTIONS.ITEM_TYPES.SET_ALL, payload: data });
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function createItemType(data) {
  return async function (dispatch) {
    try {
      const result = await remoteCreateItemType(data);
      dispatch(showMessage('Item type created', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.ITEM_TYPES.ADD, payload: result });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function updateItemType(id, data) {
  return async function (dispatch) {
    try {
      const result = await remoteUpdateItemType(id, data);
      dispatch(showMessage('Item type updated', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.ITEM_TYPES.UPDATE, payload: result });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function deleteItemType(id) {
  return async function (dispatch) {
    try {
      await remoteDeleteItemType(id);
      dispatch(showMessage('Item type deleted', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.ITEM_TYPES.REMOVE, payload: id });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}
