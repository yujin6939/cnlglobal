// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 필요' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: '토큰이 유효하지 않음' });
  }
};
