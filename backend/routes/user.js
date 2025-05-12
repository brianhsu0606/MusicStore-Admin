const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/userModel');

// 載入用戶 Read（僅限 admin）
router.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id)
    if (!currentUser || currentUser.profile.role !== 'admin') {
      return res.status(403).json({ code: 403, msg: '無權限' });
    }

    const users = await User.find().select('-password')
    const userList = users.map(user => ({
      id: user.id,
      username: user.username,
      ...user.profile
    }));

    return res.json({
      code: 200,
      msg: '獲取用戶成功',
      result: userList
    });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '伺服器錯誤' });
  }
})

// 更新用戶角色 Update
router.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
      'profile.role': role
    });

    res.json({
      code: 200,
      message: '更新用戶身份成功',
      result: null
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '更新失敗' });
  }
})

// 刪除用戶 Delete
router.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      code: 200,
      message: '刪除用戶成功',
      result: null
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '刪除失敗' });
  }
})

module.exports = router;
