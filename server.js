const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // 꼭 최상단
const MONGO_URL = process.env.MONGO_URL;  // 🔥 여기가 유일한 MONGO_URL 선언

const PORT = process.env.PORT || 3000;

// ✅ 관리자 모델 불러오기
const Admin = require('./models/Admin');

// ✅ 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 정적 파일 경로
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ 라우터 연결
const noticeRoutes = require('./routes/notices');
const authRoutes = require('./routes/auth');
const linksRoutes = require('./routes/links');

app.use('/api/notices', noticeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', linksRoutes);

// ✅ MongoDB 연결 및 관리자 계정 자동 생성
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ MongoDB 연결 성공');

  const exists = await Admin.findOne({ username: 'admin' });
  if (!exists) {
    const newAdmin = new Admin({ username: 'admin', password: 'cnlglobal123!' });
    await newAdmin.save();
    console.log('✅ 기본 관리자 계정이 생성되었습니다 (admin / cnlglobal123!)');
  } else {
    console.log('ℹ️ 이미 관리자 계정이 존재합니다');
  }
}).catch(err => {
  console.error('❌ MongoDB 연결 실패:', err);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
