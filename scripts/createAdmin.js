// scripts/createAdmin.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/noticeboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const exists = await Admin.findOne({ username: 'admin' });
  if (exists) {
    console.log('⚠️ 이미 admin 계정이 존재합니다.');
    return;
  }

  const admin = new Admin({
    username: 'admin',
    password: 'admin123', // 여기서 bcrypt 해싱이 자동으로 실행됨!
  });

  await admin.save();
  console.log('✅ 관리자 계정 생성 완료: admin / admin123');
  process.exit();
}

createAdmin();
