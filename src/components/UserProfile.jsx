import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { FaUserCircle } from "react-icons/fa";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        if (userRes.data.user.role === "celeb") {
          const postsRes = await axios.get("/posts/feed", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const celebPosts = postsRes.data.filter(
            (post) => post.author._id === userRes.data.user._id
          );
          setPosts(celebPosts);
        }
      } catch (err) {
        console.error("Error fetching user/profile:", err);
      }
    };

    fetchUserData();
  }, [token]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar">
          <FaUserCircle size={100} color="#4ac1ff" />
        </div>
        <div className="user-info">
          <h1>{user.username}</h1>
          <button className="edit-btn">Edit Profile</button>
        </div>
      </div>

      <div className="profile-stats">
        <div>
          <span className="number">{posts.length}</span>
          <span className="label">Posts</span>
        </div>
        <div>
          <span className="number">{user.followers?.length || 0}</span>
          <span className="label">Followers</span>
        </div>
        <div>
          <span className="number">{user.following?.length || 0}</span>
          <span className="label">Following</span>
        </div>
      </div>

      <div className="profile-bio">
        Photographer | Traveler | Dreamer
      </div>

      {user.role === "celeb" && (
        <>
          <h2 className="section-heading">Your Posts</h2>
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-item">
                <img
                  src={`https://social-feed-client.vercel.app/uploads/${post.image}`}
                  alt="Post"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
