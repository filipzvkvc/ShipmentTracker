import { getAxiosInstance } from './axiosProvider';

export async function remoteGetUserSubShipments(userId) {
  const res = await getAxiosInstance().get(`/v1/subShipments/user/${userId}`);
  return res.data;
}

export async function remoteGetSubShipmentsByShipment(shipmentId) {
  const res = await getAxiosInstance().get(`/v1/subShipments/${shipmentId}`);
  return res.data;
}

export async function remoteCreateSubShipment(quantity, data) {
  const res = await getAxiosInstance().post(`/v1/subShipments/${quantity}`, data);
  return res.data;
}

export async function remoteUpdateSubShipment(id, data) {
  const res = await getAxiosInstance().patch(`/v1/subShipments/${id}`, data);
  return res.data;
}

export async function remoteDeleteSubShipment(id) {
  return getAxiosInstance().delete(`/v1/subShipments/${id}`);
}

export async function remoteUploadProof(file) {
  const formData = new FormData();
  formData.append('attachment', file);
  const res = await getAxiosInstance().post('/v1/subShipments/videoUpload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function remoteGetSubShipmentStatuses() {
  const res = await getAxiosInstance().get('/v1/subShipmentStatus');
  return res.data;
}

export async function remoteUpdateSubShipmentStatus(subShipmentId, statusId) {
  const res = await getAxiosInstance().patch(`/v1/subShipments/updateStatus/${subShipmentId}/${statusId}`);
  return res.data;
}

export async function remoteUpdateSubShipmentProofPath(subShipmentId, path) {
  const res = await getAxiosInstance().patch(`/v1/subShipments/updateVideoProof/${subShipmentId}`, { path });
  return res.data;
}
