import pool from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const initialRankings = [];
    for (let grade = 1; grade <= 6; grade++) {
      for (let classNumber = 1; classNumber <= (grade < 5 ? 5 : 6); classNumber++) {
        initialRankings.push(`${grade}학년 ${classNumber}반`);
      }
    }

    try {
      console.log("테이블 초기화 시작");
      await pool.query('TRUNCATE TABLE Clicks');
      console.log("테이블이 초기화되었습니다.");

      console.log("데이터 삽입 시작");
      await Promise.all(
        initialRankings.map(classId =>
          pool.query('INSERT INTO Clicks (class, clickCount) VALUES (?, 0)', [classId])
        )
      );
      console.log("초기화된 데이터가 삽입되었습니다.");

      res.status(200).json({ message: '클릭 데이터가 초기화되었습니다.' });
    } catch (error) {
      console.error('클릭 데이터 초기화 중 에러 발생:', error);
      res.status(500).json({ error: '클릭 데이터 초기화 중 에러 발생' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
