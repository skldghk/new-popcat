import pool from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { clicks } = req.body;

    if (!clicks) {
      return res.status(400).json({ error: '클릭 데이터가 필요합니다.' });
    }

    try {
      for (const click of clicks) {
        await pool.query(
          'INSERT INTO Clicks (class, clickCount) VALUES (?, ?) ON DUPLICATE KEY UPDATE clickCount = ?',
          [click.class, click.clickCount, click.clickCount]
        );
      }

      res.status(200).json({ message: '클릭 데이터가 성공적으로 저장되었습니다.' });
    } catch (error) {
      console.error('클릭 데이터 저장 중 에러 발생:', error);
      res.status(500).json({ error: '클릭 데이터 저장 중 에러 발생' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
