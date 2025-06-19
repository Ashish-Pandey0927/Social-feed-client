import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaUser,
} from "react-icons/fa";
import "./Navbar.css";
import Parent from "./Parent";
import socket from "../api/socket"; // Ensure this is correctly configured

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(0);

  const isMobile = window.innerWidth <= 768;

  // Restore notification count from localStorage
  useEffect(() => {
    const saved = parseInt(localStorage.getItem("unreadCount")) || 0;
    setNotifications(saved);
  }, []);

  // Real-time socket listener
  useEffect(() => {
    socket.on("new_post_notification", (data) => {
      setNotifications((prev) => {
        const updated = prev + 1;
        localStorage.setItem("unreadCount", updated);
        return updated;
      });
    });

    return () => socket.off("new_post_notification");
  }, []);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const clearNotifications = () => {
    setNotifications(0);
    localStorage.setItem("unreadCount", 0);
  };

  return (
    <>
      <button className="collapse-btn" onClick={toggleSidebar} title="Toggle Sidebar">
        <FaBars />
      </button>

      <nav
        className={`sidebar ${
          isMobile
            ? isMobileOpen
              ? "open"
              : ""
            : isDesktopCollapsed
            ? "collapsed"
            : ""
        }`}
      >
        <div className="sidebar-logo">
           {!isDesktopCollapsed && !isMobile && <span className="sidebar-text">Snapora</span>}
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/" className="sidebar-link">
              <FaHome />
              {!isDesktopCollapsed && <span className="sidebar-text">Home</span>}
            </Link>
          </li>
          <li>
            <Parent>
              <div className="sidebar-link">
                <FaSearch />
                {!isDesktopCollapsed && <span className="sidebar-text">Search</span>}
              </div>
            </Parent>
          </li>
          <li onClick={clearNotifications}>
            <div className="sidebar-link notification-bell">
              <FaBell />
              {notifications > 0 && (
                <span className="notification-badge">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
              {!isDesktopCollapsed && <span className="sidebar-text">Notifications</span>}
            </div>
          </li>
          <li>
            <Link to="/profile" className="sidebar-link">
              <FaUser />
              {!isDesktopCollapsed && <span className="sidebar-text">Profile</span>}
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="sidebar-link logout-btn">
              <FaSignOutAlt />
              {!isDesktopCollapsed && <span className="sidebar-text">Logout</span>}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
