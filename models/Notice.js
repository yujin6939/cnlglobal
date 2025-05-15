// models/Notice.js
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    ko: { type: String, default: null },
    en: { type: String, default: null },
    zh: { type: String, default: null }
  },
  content: {
    ko: { type: String, default: null },
    en: { type: String, default: null },
    zh: { type: String, default: null }
  },
  category: {
    type: String,
    enum: ['notice', 'newsletter', 'resource'],
    required: true,
    default: 'notice'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Notice', noticeSchema);
