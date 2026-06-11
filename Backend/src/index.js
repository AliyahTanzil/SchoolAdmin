require('dotenv').config();
require('express-async-errors');
const express = require('express');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

// initialize database
async function start() {
  try {
    const knex = require('knex');
    const config = require('../knexfile');
    const dbMigrator = knex(config);
    console.log('Running migrations...');
    await dbMigrator.migrate.latest();
    await dbMigrator.destroy();
    
    require('./db').init();
    
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Backend running on ${port}`));
  } catch (e) {
    console.error('Startup error:', e);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
