const path = require('path');
const { openDb } = require(path.join(process.cwd(), 'src/utils/db.cjs'));

export default async function handler(req, res) {
  try {
    const db = await openDb();
    const users = await db.all('SELECT * FROM users');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
