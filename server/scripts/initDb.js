const { initDbConnection } = require('../config/db');

console.log('Initializing database tables and seed data...');
initDbConnection().then(() => {
  console.log(' Database initialization complete.');
  process.exit(0);
}).catch(err => {
  console.error(' Database initialization error:', err);
  process.exit(1);
});
