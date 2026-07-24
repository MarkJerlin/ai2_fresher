const db = require('./src/db');

async function updateClubs() {
  try {
    await db.query(`
      UPDATE clubs 
      SET registration_link = 'https://robotics-club.edu/' 
      WHERE name = 'Robotics & IoT Club'
    `);
    await db.query(`
      UPDATE clubs 
      SET registration_link = 'https://mda-arts.edu/' 
      WHERE name = 'Music & Dramatic Arts (MDA)'
    `);
    console.log('✅ Clubs updated with registration links in DB!');
  } catch (error) {
    console.error('❌ Failed to update clubs:', error.message);
  }
  process.exit(0);
}

updateClubs();
