import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axiosInstance";
import socket from "../api/socket"; // ✅ Import the socket
import {
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaEllipsisH,
} from "react-icons/fa";
import "./FeedPage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toast.configure();

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);

  const token = localStorage.getItem("token");
  const containerRef = useRef(null);

  // Fetch user and posts
  useEffect(() => {
    fetchData();
  }, [token]);

  // Infinite scroll & scroll-top
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Infinite scroll
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setDisplayPosts((prev) => [...prev, ...posts]);
      }

      setShowScrollTop(scrollTop > 200);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [posts]);

  // Real-time notification socket listener
  useEffect(() => {
    socket.on("new_post_notification", (newPost) => {
      console.log("📢 New post from celeb you follow:", newPost);
      toast.info("New post from a celeb you follow!", { autoClose: 3000 });
      setPosts((prev) => [newPost, ...prev]);
      setDisplayPosts((prev) => [newPost, ...prev]);
    });

    return () => {
      socket.off("new_post_notification");
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user);

      // ✅ Register the user ID to socket
      socket.emit("register", userRes.data.user._id);

      const postsRes = await axios.get("/posts/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const initialPosts = postsRes.data.posts || postsRes.data;
      setPosts(initialPosts);
      setDisplayPosts(initialPosts);

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "1rem" }}>Loading feed...</p>
    );
  }

  return (
    <div className="ig-feed-container" ref={containerRef}>
      {user?.role === "celebrity" && (
        <a href="/create" className="ig-create-post-button">
          + Create Post
        </a>
      )}

      {displayPosts.length === 0 ? (
        <p className="ig-no-posts">No posts available yet.</p>
      ) : (
        displayPosts.map((post, index) => (
          <div className="ig-post" key={`${post._id}-${index}`}>
            <div className="ig-post-header">
              <img
                src={
                  post.author?.profilePic || "https://via.placeholder.com/40"
                }
                alt="Profile"
                className="ig-profile-pic"
              />
              <span className="ig-username">{post.author?.username}</span>
              <FaEllipsisH className="ig-post-options" />
            </div>

            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt="Post"
                className="ig-post-image"
              />
            )}

            <div className="ig-post-actions">
              <button
                className={`ig-action-btn ${
                  likedPosts.has(post._id) ? "liked" : ""
                }`}
                onClick={() => toggleLike(post._id)}
                aria-label="Like"
              >
                {likedPosts.has(post._id) ? <FaHeart /> : <FaRegComment />}
              </button>
              <button className="ig-action-btn" aria-label="Comment">
                <FaRegComment />
              </button>
              <button className="ig-action-btn" aria-label="Share">
                <FaPaperPlane />
              </button>
            </div>

            <div className="ig-post-likes">
              {likedPosts.has(post._id) ? (
                <span>You and others liked this</span>
              ) : (
                <span>{post.likes || 0} likes</span>
              )}
            </div>

            <div className="ig-post-caption">
              <strong>{post.author?.username}</strong> {post.caption}
            </div>
          </div>
        ))
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="ig-scroll-top-btn"
          onClick={() =>
            containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
          }
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default FeedPage;
