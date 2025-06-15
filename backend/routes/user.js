const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const handleError = require('../utils/handleError')
const authenticateToken = require('../middleware/authMiddleware')

// 載入用戶 Read（僅限 superAdmin、admin）
router.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const allowedRoles = ['superadmin', 'admin']
    const currentUser = await User.findById(req.user.id)
    if (!currentUser || !allowedRoles.includes(currentUser.profile.role)) {
      return res.status(403).json({ code: 403, message: '無權限' });
    }

    const users = await User.find().select('-password')
    const userList = users.map(user => ({
      employeeId: user.employeeId,
      id: user.id,
      username: user.username,
      ...user.profile
    }));

    return res.json({
      code: 200,
      message: '獲取用戶成功',
      result: userList
    });
  } catch (error) {
    handleError(res, error, '獲取用戶失敗')
  }
})

// 更新用戶權限 Update
router.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body;

    await User.findByIdAndUpdate(
      req.params.id,
      { 'profile.role': role },
      { new: true, runValidators: true }
    );

    res.json({
      code: 200,
      message: '更新用戶權限成功',
      result: null
    });
  } catch (error) {
    handleError(res, error, '更新用戶權限失敗')
  }
})

// 刪除用戶 Delete
router.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: '找不到要刪除的用戶',
        result: null
      })
    }

    res.json({
      code: 200,
      message: '刪除用戶成功',
      result: null
    });
  } catch (error) {
    handleError(res, error, '刪除用戶失敗')
  }
})

module.exports = router