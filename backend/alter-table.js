const db = require('./src/db');

async function alterTable() {
  try {
    await db.query(`
      ALTER TABLE party_registration 
      MODIFY COLUMN tshirt_size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL') DEFAULT 'M'
    `);
    console.log('✅ Alter Table query executed successfully! tshirt_size enum updated.');
  } catch (error) {
    console.error('❌ Alter Table failed:', error.message);
  }
  process.exit(0);
}

alterTable();
