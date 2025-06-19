import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axiosInstance";
import "../components/SearchCelebs.css";

const SearchCelebs = ({ onClose }) => {
  const [celebrities, setCelebrities] = useState([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const searchTimeout = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (!query.trim()) {
      setCelebrities([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      searchCelebs();
    }, 400);

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  const searchCelebs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCelebrities(res.data.users);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (celebId) => {
  try {
    const res = await axios.post(
      `/users/follow/${celebId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update local state to reflect the follow
    setUser((prevUser) => ({
      ...prevUser,
      following: [...(prevUser.following || []), celebId],
    }));
  } catch (err) {
    console.error("Follow failed:", err);
  }
};


  return (
    <div className="modal-overlay">
      <div className="search-celebs-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Search Celebrities</h2>
        <input
          type="text"
          placeholder="Enter celeb name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div> Searching...
          </div>
        )}

        <ul>
          {celebrities.map((celeb) => {
            const isFollowing = user?.following?.includes(celeb._id);
            return (
              <li key={celeb._id}>
                {celeb.username}
                <button
                  onClick={() => handleFollow(celeb._id)}
                  disabled={isFollowing}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SearchCelebs;
