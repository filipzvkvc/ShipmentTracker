import { remoteGetAllShipments, remoteCreateShipment, remoteUpdateShipment, remoteDeleteShipment, remoteGetAllShipmentStatuses } from '../data-source/shipmentsDataSource';
import { unknownErrorThanActionHandlerFactory } from '../services/utils';
import { showMessage } from './messageActions';
import MESSAGE_TYPES from '../constants/messagesTypes';
import ACTIONS from '../constants/actionTypes';

export function fetchShipments() {
  return async function (dispatch) {
    dispatch({ type: ACTIONS.SHIPMENTS.SET_LOADING, payload: true });
    try {
      const data = await remoteGetAllShipments();
      dispatch({ type: ACTIONS.SHIPMENTS.SET_ALL, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SHIPMENTS.SET_LOADING, payload: false });
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function fetchMyShipments(employeeId) {
  return async function (dispatch) {
    dispatch({ type: ACTIONS.SHIPMENTS.SET_LOADING, payload: true });
    try {
      const data = await remoteGetAllShipments(`?employee_id=${employeeId}`);
      dispatch({ type: ACTIONS.SHIPMENTS.SET_ALL, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SHIPMENTS.SET_LOADING, payload: false });
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function fetchShipmentStatuses() {
  return async function (dispatch) {
    try {
      const data = await remoteGetAllShipmentStatuses();
      dispatch({ type: ACTIONS.SHIPMENTS.SET_STATUSES, payload: data });
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function createShipment(data) {
  return async function (dispatch) {
    try {
      await remoteCreateShipment(data);
      dispatch(showMessage('Shipment created', MESSAGE_TYPES.SUCCESS));
      const updated = await remoteGetAllShipments();
      dispatch({ type: ACTIONS.SHIPMENTS.SET_ALL, payload: updated });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function updateShipment(id, data) {
  return async function (dispatch) {
    try {
      await remoteUpdateShipment(id, data);
      dispatch(showMessage('Shipment updated', MESSAGE_TYPES.SUCCESS));
      const updated = await remoteGetAllShipments();
      dispatch({ type: ACTIONS.SHIPMENTS.SET_ALL, payload: updated });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function deleteShipment(id) {
  return async function (dispatch) {
    try {
      await remoteDeleteShipment(id);
      dispatch(showMessage('Shipment deleted', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.SHIPMENTS.REMOVE, payload: id });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}
