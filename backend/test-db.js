const db = require('./src/db');
const bcrypt = require('bcrypt');

async function diagnostics() {
  console.log('--- DIAGNOSTICS START ---');
  
  // 1. Test Bcrypt
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('testpass', salt);
    console.log('✅ Bcrypt loaded and hashed successfully. Hash:', hash);
  } catch (err) {
    console.error('❌ Bcrypt test failed:', err.message);
  }

  // 2. Test DB Connection & Table check
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log('✅ Database connected. Tables list:', rows.map(r => Object.values(r)[0]));
    
    // Check users table structure
    try {
      const [cols] = await db.query('DESCRIBE users');
      console.log('✅ "users" table exists. Columns:', cols.map(c => c.Field));
    } catch (tblErr) {
      console.error('❌ "users" table check failed:', tblErr.message);
    }
  } catch (dbErr) {
    console.error('❌ Database connection failed:', dbErr.message);
  }
  
  console.log('--- DIAGNOSTICS END ---');
  process.exit(0);
}

diagnostics();
