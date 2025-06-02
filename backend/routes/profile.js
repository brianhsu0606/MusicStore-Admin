const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/userModel');

router.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ code: 404, message: '用戶不存在' });
    }

    res.json({
      code: 200,
      message: '取得用戶資訊成功',
      result: {
        id: user.id,
        ...user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '伺服器錯誤' });
  }
});

// 更新個人資料
router.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ code: 404, message: '用戶不存在' });
    }

    user.profile = {
      ...user.profile,
      ...req.body
    }
    await user.save();

    res.json({
      code: 200,
      message: '更新成功',
      result: null
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '伺服器錯誤' });
  }
});

module.exports = router;
