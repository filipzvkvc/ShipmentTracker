import {
  remoteGetUserSubShipments,
  remoteGetSubShipmentsByShipment,
  remoteCreateSubShipment,
  remoteUpdateSubShipment,
  remoteDeleteSubShipment,
  remoteUploadProof,
  remoteGetSubShipmentStatuses,
  remoteUpdateSubShipmentStatus,
  remoteUpdateSubShipmentProofPath,
} from '../data-source/subShipmentsDataSource';
import { remoteGetAllUsers } from '../data-source/usersDataSource';
import { remoteGetAllShipments } from '../data-source/shipmentsDataSource';
import { remoteGetAllItemTypes } from '../data-source/itemTypesDataSource';
import { unknownErrorThanActionHandlerFactory } from '../services/utils';
import { showMessage } from './messageActions';
import MESSAGE_TYPES from '../constants/messagesTypes';
import ACTIONS from '../constants/actionTypes';

export function fetchUserSubShipments(userId) {
  return async function (dispatch) {
    try {
      const data = await remoteGetUserSubShipments(userId);
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.SET_USER_DATA, payload: data });
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function fetchSubShipments(shipmentId) {
  return async function (dispatch) {
    dispatch({ type: ACTIONS.SUB_SHIPMENTS.SET_LOADING, payload: true });
    try {
      const data = await remoteGetSubShipmentsByShipment(shipmentId);
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.SET_DATA, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.SET_LOADING, payload: false });
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function clearSubShipments() {
  return { type: ACTIONS.SUB_SHIPMENTS.CLEAR };
}

export function fetchSubShipmentFormData() {
  return async function (dispatch) {
    try {
      const [users, itemTypes, statuses] = await Promise.all([
        remoteGetAllUsers(),
        remoteGetAllItemTypes(),
        remoteGetSubShipmentStatuses(),
      ]);
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.SET_FORM_DATA, payload: { users, itemTypes, statuses } });
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function fetchSubShipmentStatuses() {
  return async function (dispatch) {
    try {
      const data = await remoteGetSubShipmentStatuses();
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.SET_STATUSES, payload: data });
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function uploadProof(file) {
  return async function (dispatch) {
    try {
      return await remoteUploadProof(file);
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function createSubShipment(quantity, data) {
  return async function (dispatch) {
    try {
      const result = await remoteCreateSubShipment(quantity, data);
      dispatch(showMessage('Sub-shipment created', MESSAGE_TYPES.SUCCESS));
      const updatedShipments = await remoteGetAllShipments();
      dispatch({ type: ACTIONS.SHIPMENTS.SET_ALL, payload: updatedShipments });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function updateSubShipment(id, data) {
  return async function (dispatch) {
    try {
      const result = await remoteUpdateSubShipment(id, data);
      dispatch(showMessage('Sub-shipment updated', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.UPDATE, payload: result });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function removeSubShipmentProof(subShipmentId) {
  return async function (dispatch) {
    try {
      await remoteUpdateSubShipmentProofPath(subShipmentId, null);
      dispatch(showMessage('Proof removed', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.UPDATE_PROOF, payload: { id: subShipmentId, proof: null } });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function uploadSubShipmentProof(subShipmentId, file) {
  return async function (dispatch) {
    try {
      const uploaded = await remoteUploadProof(file);
      if (!uploaded?.path) return;
      await remoteUpdateSubShipmentProofPath(subShipmentId, uploaded.path);
      dispatch(showMessage('Proof uploaded', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.UPDATE_PROOF, payload: { id: subShipmentId, proof: uploaded.path } });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function updateSubShipmentStatusAction(subShipmentId, statusId) {
  return async function (dispatch) {
    try {
      const result = await remoteUpdateSubShipmentStatus(subShipmentId, statusId);
      dispatch(showMessage('Status updated', MESSAGE_TYPES.SUCCESS));
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function deleteSubShipment(id) {
  return async function (dispatch) {
    try {
      await remoteDeleteSubShipment(id);
      dispatch(showMessage('Sub-shipment deleted', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.SUB_SHIPMENTS.REMOVE, payload: id });
      const updatedShipments = await remoteGetAllShipments();
      dispatch({ type: ACTIONS.SHIPMENTS.SET_ALL, payload: updatedShipments });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}
