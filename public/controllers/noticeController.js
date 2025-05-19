// controllers/noticeController.js
const Notice = require('../models/Notice');

exports.getAllNotices = async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
};

exports.getNoticeById = async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  res.json(notice);
};

exports.createNotice = async (req, res) => {
    const filteredPayload = {
      title: {},
      content: {}
    };
  
    ['ko', 'en', 'zh'].forEach(lang => {
      if (req.body.title?.[lang]) filteredPayload.title[lang] = req.body.title[lang];
      if (req.body.content?.[lang]) filteredPayload.content[lang] = req.body.content[lang];
    });
  
    const notice = new Notice(filteredPayload);
    await notice.save();
    res.status(201).json(notice);
  };
  

exports.updateNotice = async (req, res) => {
  const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteNotice = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
