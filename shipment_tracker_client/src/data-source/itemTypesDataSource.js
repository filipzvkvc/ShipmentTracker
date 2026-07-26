import { getAxiosInstance } from './axiosProvider';

export async function remoteGetAllItemTypes() {
  const res = await getAxiosInstance().get('/v1/itemType');
  return res.data;
}

export async function remoteCreateItemType(data) {
  const res = await getAxiosInstance().post('/v1/itemType', data);
  return res.data;
}

export async function remoteUpdateItemType(id, data) {
  const res = await getAxiosInstance().patch(`/v1/itemType/${id}`, data);
  return res.data;
}

export async function remoteDeleteItemType(id) {
  return getAxiosInstance().delete(`/v1/itemType/${id}`);
}
