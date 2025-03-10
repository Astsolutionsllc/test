import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css'; // Import the CSS file

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('http://44.208.28.102:5000/api/auth/signup', {
        email,
        password,
        business_name: businessName,
      }, {
        headers: {
          'Content-Type': 'application/json', // Explicitly set content type
        },
      });
      localStorage.setItem('token', response.data.token); // Save token to localStorage
      navigate('/dashboard'); // Redirect to dashboard after signup
    } catch (err) {
      // Enhanced error handling
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.error || 'Server error occurred');
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Check your network.');
      } else {
        // Error occurred while setting up the request
        setError('An unexpected error occurred.');
      }
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
