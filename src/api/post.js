// src/api/post.js
import axios from './axiosInstance';

export const createPost = async (formData) => {
  const res = await axios.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // if you're uploading image/video
    },
  });
  return res.data;
};

export const getFeed = async (page = 1) => {
  const res = await axios.get(`/posts/feed?page=${page}`);
  return res.data;
};

export const getUserPosts = async (userId) => {
  const res = await axios.get(`/posts/user/${userId}`);
  return res.data;
};

export const likePost = async (postId) => {
  const res = await axios.post(`/posts/${postId}/like`);
  return res.data;
};

export const deletePost = async (postId) => {
  const res = await axios.delete(`/posts/${postId}`);
  return res.data;
};
