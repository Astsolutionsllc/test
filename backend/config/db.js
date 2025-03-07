const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'licenserenewal.c9o6oe20y0qk.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: '5716855994',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
  }
  release();
});

module.exports = pool;