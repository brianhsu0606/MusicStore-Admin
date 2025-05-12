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


// #region user.js
router.get('/api/users', authenticateToken, (req, res) => {
  const users = loadUsers();


  if (req.user.role !== 'admin') {
    return res.status(403).json({ code: 403, msg: '無權限' });
  }
  // 回傳所有使用者（帳號 + profile）
  const userList = users.map(u => ({
    id: u.id,
    username: u.username,
    ...u.profile
  }));

  return res.json({
    code: 200,
    msg: '獲取用戶成功',
    result: userList
  });
});

// delete
router.delete('/api/users/:id', authenticateToken, (req, res) => {
  // const token = req.headers.authorization;
  const users = loadUsers();

  // const currentUser = users.find(u => 'mock-token-' + u.username === token);
  // if (!currentUser || currentUser.profile.role !== 'admin') {
  //   return res.status(403).json({ code: 403, msg: '無權限' });
  // }

  const { id } = req.params;
  const newUsers = users.filter(user => user.id !== id);

  fs.writeFileSync(USERS_FILE, JSON.stringify(newUsers, null, 2));

  res.json({
    code: 200,
    message: '刪除用戶成功',
    result: null
  });
});

// update
router.put('/api/users/:id', authenticateToken, (req, res) => {
  const users = loadUsers();
  const { id } = req.params
  const { role } = req.body

  const index = users.findIndex(item => item.id === id)

  users[index].profile.role = role;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({
    code: 200,
    message: '更新用戶身份成功',
    result: null
  })
})
// #endregion
module.exports = router;
