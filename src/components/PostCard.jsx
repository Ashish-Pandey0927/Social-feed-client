// src/components/PostCard.jsx
import React from 'react';
import './PostCard.css';

const PostCard = ({ post, children }) => {
  return (
    <div className="post-card">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-description">{post.description}</p>
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <p className="post-author">Posted by: {post.author.username}</p>
      {children}
    </div>
  );
};

export default PostCard;
