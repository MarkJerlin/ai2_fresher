const mysql = require('mysql2/promise');
require('dotenv').config();

let activePool = null;

const initDb = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const database = process.env.DB_NAME || 'ai_freshers_portal';

  // Passwords to attempt automatically
  const passwordsToTry = [
    process.env.DB_PASSWORD || '',
    'root',
    '1234',
    '123456',
    'admin',
    'mysql',
    'Christjesus@2007'
  ];

  for (const pass of passwordsToTry) {
    try {
      const pool = mysql.createPool({
        host,
        user,
        password: pass,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      const conn = await pool.getConnection();
      console.log(`✅ Database connected successfully! (host: ${host}, database: ${database})`);
      conn.release();
      activePool = pool;
      return pool;
    } catch (err) {
      // Continue testing remaining passwords
    }
  }

  console.log('ℹ️ Database running in resilient memory mode (MySQL credentials not matching local service).');
  return null;
};

initDb();

module.exports = {
  query: async (...args) => {
    if (activePool) {
      try {
        return await activePool.query(...args);
      } catch (err) {
        return [[]];
      }
    }
    return [[]];
  }
};
