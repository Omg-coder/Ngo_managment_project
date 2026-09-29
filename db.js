const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'pass123',
  database: process.env.PG_DATABASE || 'ngo_db',
});

// Function to initialize tables on server startup
const initDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database!');

    // Read and run schema.sql to ensure tables exist
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('PostgreSQL tables initialized successfully.');
    }

    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB
};
