import pool from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await pool.query('TRUNCATE TABLE Clicks');
      await pool.query(`
        INSERT INTO Clicks (class, clickCount) VALUES
        ('1학년 1반', 0), ('1학년 2반', 0), ('1학년 3반', 0),
        ('1학년 4반', 0), ('1학년 5반', 0),
        ('2학년 1반', 0), ('2학년 2반', 0), ('2학년 3반', 0),
        ('2학년 4반', 0), ('2학년 5반', 0),
        ('3학년 1반', 0), ('3학년 2반', 0), ('3학년 3반', 0),
        ('3학년 4반', 0), ('3학년 5반', 0),
        ('4학년 1반', 0), ('4학년 2반', 0), ('4학년 3반', 0),
        ('4학년 4반', 0), ('4학년 5반', 0),
        ('5학년 1반', 0), ('5학년 2반', 0), ('5학년 3반', 0),
        ('5학년 4반', 0), ('5학년 5반', 0), ('5학년 6반', 0),
        ('6학년 1반', 0), ('6학년 2반', 0), ('6학년 3반', 0),
        ('6학년 4반', 0), ('6학년 5반', 0), ('6학년 6반', 0)
      `);
      res.status(200).json({ message: '데이터베이스 초기화가 완료되었습니다.' });
    } catch (error) {
      console.error('데이터베이스 초기화 중 에러 발생:', error);
      res.status(500).json({ error: '데이터베이스 초기화 중 에러 발생' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
