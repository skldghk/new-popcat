const pool = require('../../utils/db');

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Clicks ORDER BY clickCount DESC');
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('클릭 데이터 조회 중 에러 발생:', error);
    res.status(500).json({ error: '클릭 데이터 조회 중 에러 발생' });
  }
}
