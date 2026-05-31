const express = require('express');
const routes = require('./routes');

const app = express();
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
