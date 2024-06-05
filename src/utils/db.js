import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'admin',
  password: 'As3182773@@',
  database: 'click_tracker'
});

export default pool;
