import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';  // Adjust the path if your Navbar is elsewhere
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/posts/feed', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-container" style={{ paddingTop: '80px' }}>
        {/* Padding top added so content is not hidden behind fixed Navbar */}
        <h2 className="home-title">📢 Latest Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-meta">
                <span className="post-author">@{post.author?.username || 'Unknown'}</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              {post.content && <p className="post-content">{post.content}</p>}
              {post.image && (
                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt="Post"
                  className="post-image"
                />
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Home;
