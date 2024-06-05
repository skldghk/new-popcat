import pool from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT class, clickCount FROM Clicks');
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('클릭 데이터 불러오기 중 에러 발생:', error);
      res.status(500).json({ error: '클릭 데이터 불러오기 중 에러 발생' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
