const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未授權，缺少 token',
      result: null
    });
  }

  jwt.verify(token, JWT_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({
        code: 403,
        message: '無效的 token',
        result: null
      });
    }

    req.user = userData;
    next();
  });
}

module.exports = authenticateToken