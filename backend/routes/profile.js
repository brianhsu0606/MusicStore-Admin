const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const handleError = require('../utils/handleError')
const authenticateToken = require('../middleware/authMiddleware')

// 獲取用戶資料 Read
router.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用戶不存在',
        result: null
      })
    }

    res.json({
      code: 200,
      message: '獲取用戶資料成功',
      result: {
        id: user.id,
        ...user.profile
      }
    })
  } catch (error) {
    handleError(res, error, '獲取用戶資料失敗')
  }
})

// 更新用戶資料 Update
router.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用戶不存在',
        result: null
      })
    }

    user.profile = {
      ...user.profile,
      ...req.body
    }
    await user.save()

    res.json({
      code: 200,
      message: '用戶資料更新成功',
      result: null
    })
  } catch (error) {
    handleError(res, error, '用戶資料更新失敗')
  }
})

module.exports = router;
