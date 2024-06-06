const pool = require('../../utils/db');

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Clicks');
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch clicks' });
  }
}
