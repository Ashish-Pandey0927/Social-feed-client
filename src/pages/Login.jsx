import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../api/axiosInstance';
import './Login.css';

const Login = () => {
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('welcomeShown');
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('welcomeShown', 'true'); // Mark welcome as shown
      }, 4000); // show for 4 seconds

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { username, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Show custom popup instead of alert
      setPopupMessage('Login successful!');
      setPopupVisible(true);

      // Auto close popup after 2.5 seconds and navigate
      setTimeout(() => {
        setPopupVisible(false);
        if (user?.role === 'celeb') {
          navigate('/create');
        } else {
          navigate('/');
        }
      }, 2500);
    } catch (err) {
      if (err.response?.data?.msg) {
        setErrorMsg(err.response.data.msg);
      } else {
        setErrorMsg('Something went wrong');
      }
    }
  };

  // Popup component
  const Popup = ({ message, onClose }) => (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <h2>Success!</h2>
        <p>{message}</p>
        <button className="popup-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );

  if (showWelcome) {
    return (
      <>
        <Navbar />
        <div className="welcome-screen">
          <h1 className="welcome-text">Welcome to Snapora</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="login-fullscreen-wrapper">
        <div className="bg-gradient-animation"></div>
        <div className="login-futuristic-wrapper">
          <div className="login-futuristic-container">
            <h1 className="login-title">Sign In</h1>
            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-wrap">
                <input
                  type="text"
                  className="input-futuristic"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="input-wrap">
                <input
                  type="password"
                  className="input-futuristic"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn-futuristic">
                Log In
              </button>
            </form>

            <p className="register-text">
              New here? <a href="/register">Create an account</a>
            </p>
          </div>
        </div>
      </div>

      {/* Render popup when visible */}
      {popupVisible && <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />}
    </>
  );
};

export default Login;
