const express = require('express');
const routes = require('./routes');

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

// initialize database schema
try {
  require('./db').init()
} catch (e) {
  console.error('DB init error:', e)
}

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Backend running on ${port}`));
}

module.exports = app;
