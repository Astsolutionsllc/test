const pool = require('../config/db.js'); // Add .js extension

exports.addLicense = async (req, res) => {
  const { license_number, issue_date, expiry_date, renewal_fee } = req.body;
  const userId = req.user.id;
  if (!license_number || !issue_date || !expiry_date || !renewal_fee) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const existingLicense = await pool.query('SELECT * FROM licenses WHERE license_number = $1', [license_number]);
    if (existingLicense.rows.length > 0) {
      return res.status(400).json({ error: 'License number already exists' });
    }
    const result = await pool.query(
      'INSERT INTO licenses (user_id, license_number, issue_date, expiry_date, renewal_fee) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, license_number, issue_date, expiry_date, renewal_fee]
    );
    console.log('License added:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding license:', err);
    res.status(500).json({ error: 'An error occurred while adding the license', details: err.message });
  }
};

exports.renewLicense = async (req, res) => {
  const { license_id } = req.body;
  const documentPath = req.file ? req.file.path : null;
  const userId = req.user.id;
  try {
    const licenseResult = await pool.query('SELECT * FROM licenses WHERE id = $1 AND user_id = $2', [license_id, userId]);
    if (licenseResult.rows.length === 0) {
      return res.status(403).json({ error: 'You do not have permission to renew this license' });
    }
    const updatedLicense = await pool.query(
      'UPDATE licenses SET document_path = $1, status = $2 WHERE id = $3 RETURNING *',
      [documentPath, 'pending', license_id]
    );
    res.status(200).json(updatedLicense.rows[0]);
  } catch (err) {
    console.error('Error renewing license:', err);
    res.status(500).json({ error: 'An error occurred while renewing the license' });
  }
};

exports.getLicenses = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query('SELECT * FROM licenses WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching licenses:', err);
    res.status(500).json({ error: 'An error occurred while fetching licenses' });
  }
};

module.exports = exports;