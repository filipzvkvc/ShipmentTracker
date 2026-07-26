import { getAxiosInstance } from './axiosProvider';

export async function remoteGetAllShipments(query = '') {
  const res = await getAxiosInstance().get(`/v1/shipment${query}`);
  return res.data;
}

export async function remoteCreateShipment(data) {
  const res = await getAxiosInstance().post('/v1/shipment', data);
  return res.data;
}

export async function remoteUpdateShipment(id, data) {
  const res = await getAxiosInstance().patch(`/v1/shipment/${id}`, data);
  return res.data;
}

export async function remoteDeleteShipment(id) {
  return getAxiosInstance().delete(`/v1/shipment/${id}`);
}

export async function remoteGetAllShipmentStatuses() {
  const res = await getAxiosInstance().get('/v1/shipmentStatus');
  return res.data;
}
