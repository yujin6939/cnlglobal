const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // 꼭 최상단
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

const Admin = require('./models/Admin');

// ✅ CORS 설정 (🔥 이 부분 중요!)
const corsOptions = {
  origin: 'https://cnlglobal.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // 🔥 OPTIONS 요청 허용

// ✅ 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ 라우터
const noticeRoutes = require('./routes/notices');
const authRoutes = require('./routes/auth');
const linksRoutes = require('./routes/links');

app.use('/api/notices', noticeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', linksRoutes);

// ✅ MongoDB 연결 + 관리자 계정 생성
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

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
