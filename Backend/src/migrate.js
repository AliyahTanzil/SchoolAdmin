const knex = require('knex');
const config = require('../knexfile');

async function migrate() {
  const db = knex(config);
  try {
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

migrate();
