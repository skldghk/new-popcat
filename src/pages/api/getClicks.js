import pool from '../../utils/db';

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Clicks');
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error fetching clicks data:', error);
    res.status(500).json({ error: 'Failed to fetch clicks' });
  }
}
