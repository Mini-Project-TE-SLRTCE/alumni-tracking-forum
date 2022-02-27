import axios from 'axios';
import backendUrl from '../backendUrl';

export let token = null;

const setToken = (newToken) => {
  token = newToken;
};

const login = async (credentials) => {
  const response = await axios.post(`${backendUrl}/api/login`, credentials);
  return response.data;
};

const signup = async (enteredData) => {
  const response = await axios.post(`${backendUrl}/api/signup`, enteredData);
  return response.data;
};

const forgotPwd = async (email) => {
  const response = await axios.post(`${backendUrl}/api/forgot-pwd`, email);
  return response.data;
};

const resetPwd = async (enteredData) => {
  const response = await axios.post(`${backendUrl}/api/reset-pwd`, enteredData);
  return response.data;
};

const authService = { setToken, login, signup, forgotPwd, resetPwd };

export default authService;
