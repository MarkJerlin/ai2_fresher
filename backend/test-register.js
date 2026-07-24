const db = require('./src/db');
const bcrypt = require('bcrypt');

async function testRegister() {
  try {
    const name = 'Test User';
    const email = 'test@student.edu';
    const password = 'password123';
    const role = 'student';
    const department = null;
    const roll_no = null;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, department, roll_no) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, department, roll_no]
    );

    console.log('✅ Insertion successful! Inserted ID:', result.insertId);
    
    // Clean up
    await db.query('DELETE FROM users WHERE id = ?', [result.insertId]);
    console.log('✅ Cleaned up successfully.');
  } catch (error) {
    console.error('❌ Insertion failed with error:', error);
  }
  process.exit(0);
}

testRegister();
