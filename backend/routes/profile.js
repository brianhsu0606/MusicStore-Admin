const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require('path')

const { authenticateToken } = require('../middleware/auth')

const USERS_FILE = path.join(__dirname, '../data/users.json');
const loadUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }
  return [];
};

// #region profile.js
router.get('/api/profile', authenticateToken, (req, res) => {

  const users = loadUsers();

  const user = users.find(u => u.id === req.user.id); // 用 JWT 中的 id 找用戶

  if (!user) {
    return res.status(404).json({ code: 404, message: '用戶不存在' });
  }

  return res.json({
    code: 200,
    message: '取得用戶資訊成功',
    result: {
      id: user.id,
      ...user.profile
    }
  });
});

router.put('/api/profile', authenticateToken, (req, res) => {

  const users = loadUsers();

  const userIndex = users.findIndex(u => u.id === req.user.id); // 用 JWT 中的 id 找用戶


  if (userIndex === -1) {
    return res.status(404).json({ code: 404, message: '用戶不存在' });

  }

  // 更新 profile 欄位
  const updatedProfile = req.body;
  users[userIndex].profile = {
    ...users[userIndex].profile,
    ...updatedProfile
  };

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.json({
    code: 200,
    message: '更新成功',
    result: null
  });
});
// #endregion
module.exports = router;
