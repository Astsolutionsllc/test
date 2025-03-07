import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RenewLicenseForm from './RenewLicenseForm';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [licenses, setLicenses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch licenses on component mount
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view licenses');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/licenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLicenses(response.data); // Set all licenses, filter active later
      } catch (error) {
        console.error('Error fetching licenses:', error);
        setError('Failed to fetch licenses. Please try again.');
      }
    };

    fetchLicenses();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Calculate active licenses
  const activeLicenses = licenses.filter(license => license.status === 'active');

  // Calculate licenses expiring within 10 days
  const expiringLicenses = activeLicenses.filter(license => {
    const expiryDate = new Date(license.expiry_date);
    const today = new Date();
    const tenDaysFromNow = new Date(today.setDate(today.getDate() + 10));
    return expiryDate <= tenDaysFromNow && expiryDate >= today;
  }).length;

  // Mock ads data
  const ads = [
    { id: 1, text: 'Ad 1: Special Offer!', link: 'https://example.com/ad1' },
    { id: 2, text: 'Ad 2: Limited Time Deal!', link: 'https://example.com/ad2' },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content (Left Side) */}
      <div className="main-content">
        {/* Quick Stats Section */}
        <div className="quick-stats">
          <h2>Quick Stats</h2>
          <p>Active Licenses: {activeLicenses.length}</p>
          <p>Licenses Expiring Within 10 Days: {expiringLicenses}</p>
        </div>

        {/* Subscription Upsell Section */}
        <div className="subscription-upsell">
          <h2>Upgrade to Pro</h2>
          <p>Get access to advanced features and priority support.</p>
          <button onClick={() => navigate('/subscribe')}>Subscribe Now</button>
        </div>

        {/* License List Section */}
        <div className="license-list">
          <h2>Active Licenses</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {activeLicenses.length > 0 ? (
            <ul>
              {activeLicenses.map((license) => (
                <li key={license.id}>
                  <p>License Number: {license.license_number}</p>
                  <p>Expiry Date: {license.expiry_date}</p>
                  <p>Status: {license.status}</p>
                  {new Date(license.expiry_date) <= new Date(new Date().setDate(new Date().getDate() + 10)) && (
                    <p style={{ color: 'orange' }}>Expiring within 10 days!</p>
                  )}
                  {/* Pass licenseId to RenewLicenseForm */}
                  <RenewLicenseForm licenseId={license.id} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No active licenses found. <a href="/add-license">Add license</a></p>
          )}
        </div>
      </div>

      {/* Ad Section (Right Side) */}
      <div className="ad-section">
        <h2>Advertisements</h2>
        {ads.map((ad) => (
          <div key={ad.id}>
            <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.text}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;