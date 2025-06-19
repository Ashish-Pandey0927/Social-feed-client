import React, { useState } from 'react';
import { registerUser } from '../api/auth'; // ✅ correct
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'public',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Popup state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.trimStart(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await registerUser(form);

      // Show popup instead of alert
      setPopupMessage('Registered successfully!');
      setPopupVisible(true);

      // Auto close popup after 2.5 seconds and navigate to login
      setTimeout(() => {
        setPopupVisible(false);
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Popup component
  const Popup = ({ message, onClose }) => (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>Success!</h2>
        <p>{message}</p>
        <button className="popup-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="login-fullscreen-wrapper" style={{ paddingTop: '80px' }}>
        <div className="bg-gradient-animation"></div>

        <div className="login-futuristic-wrapper">
          <div className="login-futuristic-container">
            <h1 className="login-title">Register</h1>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-wrap">
                <input
                  type="text"
                  className="input-futuristic"
                  placeholder="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="input-wrap">
                <input
                  type="password"
                  className="input-futuristic"
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>

              <div className="input-wrap">
                <select
                  className="input-futuristic"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="public">Public</option>
                  <option value="celeb">Celebrity</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-futuristic"
                disabled={loading || !form.username || !form.password}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="register-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Render popup when visible */}
      {popupVisible && <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />}
    </>
  );
};

export default Register;
