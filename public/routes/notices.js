const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice'); // ✅ 반드시 추가
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// 🔹 업로드용 multer 설정
const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// ✅ 공지사항 조회 및 검색 + 언어 필터링 (기본 10개씩)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
const perPage = parseInt(req.query.limit) || 10;

  const keyword = req.query.q;
  const lang = req.query.lang || null;

let query = {};
const category = req.query.category;

if (keyword && lang) {
  query = {
    $and: [
      { category: category }, // ✅ 카테고리 필터
      {
        $or: [
          { [`title.${lang}`]: new RegExp(keyword, 'i') },
          { [`content.${lang}`]: new RegExp(keyword, 'i') }
        ]
      }
    ]
  };
} else if (lang && category) {
  query = {
    category: category,
    [`title.${lang}`]: { $ne: null },
    [`content.${lang}`]: { $ne: null }
  };
} else if (lang) {
  query = {
    [`title.${lang}`]: { $ne: null },
    [`content.${lang}`]: { $ne: null }
  };
} else if (category) {
  query = { category: category };
} else if (keyword) {
  query = {
    $or: [
      { 'title.ko': new RegExp(keyword, 'i') },
      { 'title.en': new RegExp(keyword, 'i') },
      { 'title.zh': new RegExp(keyword, 'i') },
      { 'content.ko': new RegExp(keyword, 'i') },
      { 'content.en': new RegExp(keyword, 'i') },
      { 'content.zh': new RegExp(keyword, 'i') }
    ]
  };
}


  try {
    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({ notices, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});

      

// ✅ 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    res.json(notice);
  } catch (err) {
    res.status(404).json({ error: '해당 공지 없음' });
  }
});

// ✅ 등록 (관리자 페이지에 인증이 없다면 auth 제거)
router.post('/', async (req, res) => {
  const filteredPayload = {
    title: {},
    content: {}
  };

  ['ko', 'en', 'zh'].forEach(lang => {
    if (req.body.title?.[lang]) filteredPayload.title[lang] = req.body.title[lang];
    if (req.body.content?.[lang]) filteredPayload.content[lang] = req.body.content[lang];
  });

  if (Object.keys(filteredPayload.title).length === 0) {
    return res.status(400).json({ error: '제목이 없습니다' });
  }

  try {
    const notice = new Notice({
      ...filteredPayload,
      category: req.body.category || 'notice' // ✅ category 저장되도록 추가
    });
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: '저장 중 오류' });
  }
});


// ✅ 수정
router.put('/:id', async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '수정 실패' });
  }
});

// ✅ 삭제
router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '삭제 실패' });
  }
});

// ✅ 이미지 업로드
router.post('/upload', upload.single('image'), (req, res) => {
  res.json({ url: '/uploads/' + req.file.filename });
});

module.exports = router;
