import axios from 'axios';
import backendUrl from '../backendUrl';
import { token } from './auth';

const baseUrl = `${backendUrl}/api/users`;

const setConfig = () => {
  return {
    headers: { 'x-auth-token': token },
  };
};

const getUser = async (username, limit, page) => {
  const response = await axios.get(
    `${baseUrl}/${username}/?limit=${limit}&page=${page}`
  );
  return response.data;
};

const updateUser = async (details) => {
  const response = await axios.put(
    `${baseUrl}/${details.id}`,
    details,
    setConfig()
  );
  return response.data;
};

const uploadAvatar = async (avatarObj) => {
  const response = await axios.post(
    `${baseUrl}/avatar`,
    avatarObj,
    setConfig()
  );
  return response.data;
};

const removeAvatar = async () => {
  const response = await axios.delete(`${baseUrl}/avatar`, setConfig());
  return response.data;
};

const getSearchResults = async (query, limit, page) => {
  const response = await axios.get(
    `${baseUrl}/search/?query=${query}&limit=${limit}&page=${page}`
  );
  return response.data;
};

const userService = {
  getUser,
  updateUser,
  uploadAvatar,
  removeAvatar,
  getSearchResults
};

export default userService;
