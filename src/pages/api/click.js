import pool from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({ error: 'classId가 필요합니다.' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO Clicks (class, clickCount) VALUES (?, 1) ON DUPLICATE KEY UPDATE clickCount = clickCount + 1',
        [classId]
      );

      res.status(200).json({ message: '클릭 데이터가 성공적으로 저장되었습니다.' });
    } catch (error) {
      console.error('클릭 데이터 저장 중 에러 발생:', error);
      res.status(500).json({ error: '클릭 데이터 저장 중 에러 발생' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
