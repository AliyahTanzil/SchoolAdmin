require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
<<<<<<< HEAD
const routesV2 = require('./routesV2');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API versioning
app.use('/api/v1', routes); // Legacy endpoints
app.use('/api/v2', routesV2); // New endpoints with enhanced features
app.use('/api', routesV2); // Latest version (redirects to v2)

// API version endpoint
app.get('/api/version', (req, res) => {
  res.json({
    version: '2.0',
    latest: 'v2',
    deprecated: ['v1'],
    deprecationNotice: {
      v1: {
        deprecated: true,
        sunsetDate: '2025-06-19',
        migrateTo: 'v2'
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    require('./db').db.prepare('SELECT 1').get();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (e) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: e.message
    });
  }
});

// Initialize database schema
try {
  require('./db').init()
  console.log('Database initialized successfully')
} catch (e) {
  console.error('DB init error:', e)
=======
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
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
}

// Initialize RBAC system
try {
  require('./middleware/rbac').initRBAC()
  console.log('RBAC system initialized successfully')
} catch (e) {
  console.error('RBAC init error:', e)
}

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable not set. Using default is not recommended for production.')
}

if (require.main === module) {
<<<<<<< HEAD
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
    console.log(`API v1: http://localhost:${port}/api/v1`);
    console.log(`API v2: http://localhost:${port}/api/v2`);
    console.log(`Health: http://localhost:${port}/health`);
  });
=======
  start();
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
}

module.exports = app;
