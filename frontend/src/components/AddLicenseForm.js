import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddLicenseForm = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [renewalFee, setRenewalFee] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!licenseNumber || !issueDate || !expiryDate || !renewalFee) {
      setError('All fields are required');
      return;
    }

    if (new Date(issueDate) >= new Date(expiryDate)) {
      setError('Issue date must be before expiry date');
      return;
    }

    if (isNaN(renewalFee) || parseFloat(renewalFee) <= 0) {
      setError('Renewal fee must be a positive number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to add a license');
        navigate('/login');
        return;
      }

      console.log('Submitting:', {
        license_number: licenseNumber,
        issue_date: issueDate,
        expiry_date: expiryDate,
        renewal_fee: parseFloat(renewalFee),
      });

      const response = await axios.post(
        'http://localhost:5000/api/licenses',
        {
          license_number: licenseNumber,
          issue_date: issueDate,
          expiry_date: expiryDate,
          renewal_fee: parseFloat(renewalFee),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('License added:', response.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding license:', err.response || err.message);
      setError(err.response?.data?.error || 'An error occurred while adding the license');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add License</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>License Number:</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Issue Date:</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Expiry Date:</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Renewal Fee:</label>
          <input
            type="number"
            step="0.01"
            value={renewalFee}
            onChange={(e) => setRenewalFee(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add License'}
        </button>
      </form>
    </div>
  );
};

export default AddLicenseForm;