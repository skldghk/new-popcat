import pool from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { clicks } = req.body;

    // 클릭 데이터가 잘 들어오는지 확인하는 로깅
    console.log('Received clicks data:', clicks);

    // clicks가 undefined나 null인 경우 빈 배열로 초기화
    if (!clicks) {
      return res.status(400).json({ error: 'clicks 데이터가 필요합니다.' });
    }

    // clicks 데이터가 배열이라고 가정하고, 각 항목에 대해 기본값을 설정합니다.
    const clickDataWithDefaults = clicks.map(click => ({
      class: click.class || '',
      clickCount: click.clickCount || 0,
    }));

    try {
      const promises = clickDataWithDefaults.map(click =>
        pool.query(
          'INSERT INTO Clicks (class, clickCount) VALUES (?, ?) ON DUPLICATE KEY UPDATE clickCount = VALUES(clickCount)',
          [click.class, click.clickCount]
        )
      );

      await Promise.all(promises);
      res.status(200).json({ message: 'Clicks saved successfully' });
    } catch (error) {
      console.error('Error saving clicks:', error);
      res.status(500).json({ error: 'Error saving clicks' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
