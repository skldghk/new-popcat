import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './utils/db.js'; // 데이터베이스 연결 설정이 포함된 파일 경로

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server);

app.use(bodyParser.json());

// ES 모듈에서 현재 파일 경로 얻기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 서버가 실행되는 위치에서 상대적으로 public 폴더 위치 지정
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('click', async (data) => {
    try {
      const sql = `INSERT INTO Clicks (class, clickCount) VALUES (?, 1) ON DUPLICATE KEY UPDATE clickCount = clickCount + 1;`;
      await pool.query(sql, [data.classId]);
      io.emit('clickUpdate', { classId: data.classId, newCount: data.newCount });
      console.log('Click count updated and emitted.');
    } catch (error) {
      console.error('Database error:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// 클릭 데이터 저장 API
app.post('/api/click', async (req, res) => {
  const { classId } = req.body;
  const sql = `
    INSERT INTO Clicks (class, clickCount) VALUES (?, 1)
    ON DUPLICATE KEY UPDATE clickCount = clickCount + 1;
  `;
  try {
    await pool.query(sql, [classId]);
    res.status(200).send({ message: '클릭 수 업데이트 성공' });
  } catch (error) {
    console.error('클릭 수 업데이트 실패:', error);
    res.status(500).send({ message: '클릭 수 업데이트 실패', error: error.message });
  }
});

server.listen(3001, () => {
  console.log(`Server running on http://localhost:3001`);
});
