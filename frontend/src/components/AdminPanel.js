import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [licenses, setLicenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Fetch all licenses
  const fetchLicenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/licenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLicenses(res.data);
    } catch (err) {
      setError('Failed to fetch licenses');
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  // Approve a renewal
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/admin/approve-renewal/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Renewal approved successfully');
      fetchLicenses(); // Refresh the licenses list
    } catch (err) {
      alert('Failed to approve renewal');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLicenses();
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Licenses</h2>
      {licenses.length > 0 ? (
        licenses.map((license) => (
          <div key={license.id}>
            <p>
              License: {license.license_number} | Status: {license.status}
            </p>
            <button onClick={() => handleApprove(license.id)}>Approve</button>
          </div>
        ))
      ) : (
        <p>No licenses found.</p>
      )}

      <h2>Users</h2>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id}>
            <p>
              User: {user.email} | Business: {user.business_name}
            </p>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminPanel;