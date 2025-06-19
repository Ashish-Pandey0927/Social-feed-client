// src/api/auth.js
import axios from './axiosInstance';

export const loginUser = async (username, password) => {
  const res = await axios.post('/auth/login', { username, password });
  return res.data; // should contain { token, user }
};

export const registerUser = async (payload) => {
  const res = await axios.post('/auth/register', payload);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get('/auth/me'); // if your backend supports this
  return res.data;
};
