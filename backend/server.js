const express = require('express');
const cors = require('cors');
const pool = require('./config/db.js'); // Add .js extension
const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://44.208.28.102:3000',
  credentials: true
}));

const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const licenseRoutes = require('./routes/licenseRoutes.js');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/licenses', licenseRoutes);

app.get('/test', (req, res) => res.json({ message: 'API is working' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
