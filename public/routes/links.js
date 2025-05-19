const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 저장 경로는 프로젝트 내 data 디렉토리로 가정
const SAVE_PATH = path.join(__dirname, '../data/links.json');

// POST /api/save-links
router.post('/save-links', (req, res) => {
  const data = req.body;

  fs.writeFile(SAVE_PATH, JSON.stringify(data, null, 2), 'utf8', err => {
    if (err) {
      console.error('❌ 링크 저장 실패:', err);
      return res.status(500).json({ message: '링크 저장 중 오류 발생' });
    }
    res.json({ message: '링크가 성공적으로 저장되었습니다' });
  });
});

module.exports = router;
