import React, { useState } from 'react';
import axios from 'axios';

const RenewLicenseForm = ({ licenseId }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a document');
      return;
    }

    const formData = new FormData();
    formData.append('license_id', licenseId);
    formData.append('document', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/licenses/renew', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response (e.g., show a success message)
      alert('License renewal request submitted successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error renewing license:', error);
      alert('An error occurred while renewing the license.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Renew License</button>
    </form>
  );
};

export default RenewLicenseForm;