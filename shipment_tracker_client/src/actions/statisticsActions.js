import { remoteGetShipmentsByMonth, remoteGetItemTypesStatistics } from '../data-source/statisticsDataSource';
import { unknownErrorThanActionHandlerFactory } from '../services/utils';

export function fetchShipmentsByMonth(dateFrom, dateTo) {
  return async function (dispatch) {
    try {
      return await remoteGetShipmentsByMonth(dateFrom, dateTo);
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}

export function fetchItemTypesStatistics() {
  return async function (dispatch) {
    try {
      return await remoteGetItemTypesStatistics();
    } catch (error) {
      unknownErrorThanActionHandlerFactory(dispatch)(error);
    }
  };
}
