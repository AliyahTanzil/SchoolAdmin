const knex = require('knex');
const path = require('path');
const config = require('../knexfile');
const db = require('../src/db');
const crypto = require('crypto');

async function setupTestDB() {
  jest.setTimeout(60000);
  
  // Use a unique shared memory database per test file
  // This is faster than physical files and avoids I/O collisions
  const id = crypto.randomBytes(8).toString('hex');
  const sharedMemoryDb = `file:mem-${id}?mode=memory&cache=shared`;
  
  process.env.DB_FILE = sharedMemoryDb;
  process.env.USE_SQLITE_IN_MEMORY = '0'; // We use DB_FILE instead

  const dbMigrator = knex({
    ...config,
    connection: {
      filename: sharedMemoryDb
    }
  });
  
  await dbMigrator.migrate.latest();
  await dbMigrator.destroy();
  
  db.init();
}

module.exports = { setupTestDB };
