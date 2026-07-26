import { getAxiosInstance } from './axiosProvider';

export async function remoteGetShipmentsByMonth(dateFrom, dateTo) {
  const res = await getAxiosInstance().get(`/v1/statistic/getShipmentsByMonth/${dateFrom}/${dateTo}`);
  return res.data;
}

export async function remoteGetItemTypesStatistics() {
  const res = await getAxiosInstance().get('/v1/statistic/getItemTypesStatistics');
  return res.data;
}
