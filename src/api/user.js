// src/api/user.js
import axios from './axiosInstance';

export const getUserProfile = async (userId) => {
  const res = await axios.get(`/users/${userId}`);
  return res.data;
};

export const followUser = async (celebId) => {
  const res = await axios.post(`/users/${celebId}/follow`);
  return res.data;
};
