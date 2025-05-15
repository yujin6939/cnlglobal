// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const noticeRoutes = require('./routes/notices');

const app = express();
const PORT = 3000;

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

// DB 연결
mongoose.connect('mongodb://localhost:27017/noticeboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB 연결 성공'))
  .catch(err => console.error('❌ MongoDB 연결 실패', err));

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // admin.html이 여기에 있음

// 라우터
app.use('/api/notices', noticeRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행됨: http://localhost:${PORT}`);
});





app.use('/api/auth', authRoutes); // 로그인용
app.use('/api/notices', noticeRoutes); // 공지는 아래에서 보호 적용