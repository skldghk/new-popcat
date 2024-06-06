const pool = require('../../utils/db');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const clicks = req.body.clicks;
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      for (let click of clicks) {
        await connection.query(
          'UPDATE Clicks SET clickCount = ? WHERE class = ?',
          [click.clickCount, click.class]
        );
      }

      await connection.commit();
      connection.release();
      res.status(200).json({ message: '클릭 데이터가 성공적으로 저장되었습니다.' });
    } catch (error) {
      console.error('Error saving clicks:', error);
      res.status(500).json({ message: '클릭 데이터 저장 실패', error });
    }
  } else {
    res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }
}
