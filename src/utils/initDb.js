const { openDb } = require('./db.js/index.js');

async function setup() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  await db.run('INSERT INTO users (name) VALUES (?)', ['John Doe']);
  await db.run('INSERT INTO users (name) VALUES (?)', ['Jane Doe']);
  console.log('Database setup complete.');
}

setup();
