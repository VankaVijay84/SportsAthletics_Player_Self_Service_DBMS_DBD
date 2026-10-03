const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

let pool = null;

const initDbConnection = async () => {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root';
  const dbName = process.env.DB_NAME || 'sports_athletics_db';
  const dbPort = process.env.DB_PORT || 3306;

  try {
    // Check & create database if not exists
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    // Create pool
    pool = mysql.createPool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log(` MySQL Database pool established: ${dbName}@${dbHost}`);
  } catch (err) {
    console.error(' MySQL Connection Error:', err.message);
    throw err;
  }
};

const query = async (sql, params = []) => {
  if (!pool) {
    throw new Error('Database connection pool is not initialized');
  }
  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = {
  initDbConnection,
  query
};
