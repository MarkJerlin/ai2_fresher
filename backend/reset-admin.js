const db = require('./src/db');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@university.edu']);

    if (existing.length > 0) {
      await db.query('UPDATE users SET password = ?, role = ? WHERE email = ?', [
        hashedPassword,
        'admin',
        'admin@university.edu'
      ]);
      console.log('✅ Admin user password updated to "admin123" successfully!');
    } else {
      await db.query(
        'INSERT INTO users (name, email, password, role, department, roll_no) VALUES (?, ?, ?, ?, ?, ?)',
        ['System Admin', 'admin@university.edu', hashedPassword, 'admin', 'CSE', 'ADM2026001']
      );
      console.log('✅ Admin user created with email "admin@university.edu" and password "admin123"!');
    }
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err.message);
  }
  process.exit(0);
}

seedAdmin();
