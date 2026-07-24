const db = require('./src/db');
const bcrypt = require('bcrypt');

async function testAdminLogin() {
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', ['admin@university.edu']);
  if (users.length === 0) {
    console.log('User not found!');
    process.exit(1);
  }
  const user = users[0];
  const validPassword = await bcrypt.compare('admin123', user.password);
  console.log('Password check result for admin123:', validPassword);
  process.exit(0);
}

testAdminLogin();
