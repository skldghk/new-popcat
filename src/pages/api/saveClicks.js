const pool = require('../../utils/db');

export default async function handler(req, res) {
  const { clicks } = req.body;
  try {
    for (const click of clicks) {
      await pool.query('UPDATE Clicks SET clickCount = ? WHERE class = ?', [click.clickCount, click.class]);
    }
    res.status(200).json({ message: 'Clicks saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save clicks' });
  }
}
