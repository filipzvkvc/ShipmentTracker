import { getAxiosInstance } from './axiosProvider';
import { mapKeysToCamelCase } from '../services/utils';

export async function remoteGetAllCountries() {
  const res = await getAxiosInstance().get('/v1/country');
  return res.data.map(item => mapKeysToCamelCase(item));
}

export async function remoteCreateCountry(name) {
  const res = await getAxiosInstance().post('/v1/country', { name });
  return mapKeysToCamelCase(res.data);
}

export async function remoteUpdateCountry(id, name) {
  const res = await getAxiosInstance().patch(`/v1/country/${id}`, { name });
  return mapKeysToCamelCase(res.data);
}

export async function remoteDeleteCountry(id) {
  return getAxiosInstance().delete(`/v1/country/${id}`);
}
