const express = require('express');
const router = express.Router();
const pool = require('../config/db.js'); // Add .js extension
const adminController = require('../controllers/adminController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const sendEmail = require('../utils/email.js');

router.post('/approve-renewal/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE licenses SET status = $1 WHERE id = $2', ['approved', id]);
    const result = await pool.query('SELECT email FROM users WHERE id = (SELECT user_id FROM licenses WHERE id = $1)', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User or license not found' });
    }
    const userEmail = result.rows[0].email;
    sendEmail(userEmail, 'Renewal Approved', 'Your license renewal has been approved.');
    res.json({ message: 'Renewal approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', authMiddleware, adminController.getAllUsers);
router.get('/licenses', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM licenses');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;