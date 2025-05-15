// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// 로그인 요청
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
  
    console.log('[로그인 시도] username:', username);
    if (!admin) {
      console.log('→ 관리자 계정 없음');
      return res.status(401).json({ message: '로그인 실패' });
    }
  
    const passwordMatch = await admin.comparePassword(password);
    console.log('→ 비밀번호 일치 여부:', passwordMatch);
  
    if (!passwordMatch) {
      return res.status(401).json({ message: '로그인 실패' });
    }
  
    const token = jwt.sign({ id: admin._id }, 'secret-key', { expiresIn: '1h' });
    res.json({ token });
  });
  

module.exports = router;
