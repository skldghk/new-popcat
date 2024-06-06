const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'svc.sel5.cloudtype.app',
  port: process.env.DB_PORT || 31577,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'As31882773@@',
  database: process.env.DB_NAME || 'click_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
