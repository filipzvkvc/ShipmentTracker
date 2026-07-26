import { remoteGetAllUsers, remoteCreateUser, remoteUpdateUser, remoteDeleteUser } from '../data-source/usersDataSource';
import { unknownErrorThanActionHandlerFactory } from '../services/utils';
import { showMessage } from './messageActions';
import MESSAGE_TYPES from '../constants/messagesTypes';
import ACTIONS from '../constants/actionTypes';

export function fetchUsers() {
  return async function (dispatch) {
    try {
      const data = await remoteGetAllUsers();
      dispatch({ type: ACTIONS.USERS.SET_ALL, payload: data });
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function createUser(userData) {
  return async function (dispatch) {
    try {
      const result = await remoteCreateUser(userData);
      dispatch(showMessage('User created. Password was sent to their email.', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.USERS.ADD, payload: result });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function updateUser(userId, userData) {
  return async function (dispatch) {
    try {
      const result = await remoteUpdateUser(userId, userData);
      dispatch(showMessage('User updated', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.USERS.UPDATE, payload: result });
      return result;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function deleteUser(userId) {
  return async function (dispatch) {
    try {
      await remoteDeleteUser(userId);
      dispatch(showMessage('User deleted', MESSAGE_TYPES.SUCCESS));
      dispatch({ type: ACTIONS.USERS.REMOVE, payload: userId });
      return true;
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}
