import { getAxiosInstance } from './axiosProvider';
import { mapKeysToCamelCase, mapKeysToSnakeCase } from '../services/utils';

export async function remoteGetAllUsers() {
  const res = await getAxiosInstance().get('/v1/users');
  return res.data.map(item => mapKeysToCamelCase(item));
}

export async function remoteCreateUser(userObj) {
  const res = await getAxiosInstance().post('/v1/users', mapKeysToSnakeCase(userObj));
  return mapKeysToCamelCase(res.data);
}

export async function remoteUpdateUser(userId, userObj) {
  const res = await getAxiosInstance().patch(`/v1/users/${userId}`, mapKeysToSnakeCase(userObj));
  return mapKeysToCamelCase(res.data);
}

export async function remoteDeleteUser(userId) {
  return getAxiosInstance().delete(`/v1/users/${userId}`);
}
