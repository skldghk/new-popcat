import pool from './db';

export async function saveClicks(clickData) {
  const clickDataWithDefaults = clickData.map(click => ({
    class: click.class || '',
    clickCount: click.clickCount || 0,
  }));

  const promises = clickDataWithDefaults.map(click =>
    pool.query(
      'INSERT INTO Clicks (class, clickCount) VALUES (?, ?) ON DUPLICATE KEY UPDATE clickCount = VALUES(clickCount)',
      [click.class, click.clickCount]
    )
  );

  return Promise.all(promises);
}
