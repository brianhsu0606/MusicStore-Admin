const express = require('express')
const router = express.Router()
const Member = require('../models/memberModel')
const handleError = require('../utils/handleError')
const authenticateToken = require('../middleware/authMiddleware')

// 讀取會員 Read
router.get('/api/members', authenticateToken, async (req, res) => {
  try {
    const memberList = await Member.find().sort({ createdAt: -1 })

    res.json({
      code: 200,
      message: '讀取會員成功',
      result: memberList
    })
  } catch (error) {
    handleError(res, error, '獲取會員失敗')
  }
})

// 新增會員 Create
router.post('/api/members', authenticateToken, async (req, res) => {
  try {
    const newMember = await Member.create(req.body)

    res.json({
      code: 200,
      message: '新增會員成功',
      result: newMember
    })
  } catch (error) {
    handleError(res, error, '新增會員失敗')
  }
})

// 更新會員 Update
router.put('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedMember) {
      return res.status(404).json({
        code: 404,
        message: '找不到要更新的會員資料',
        result: null
      })
    }

    res.json({
      code: 200,
      message: '更新會員成功',
      result: updatedMember
    })
  } catch (error) {
    handleError(res, error, '更新會員失敗')
  }
})

// 刪除會員 Delete
router.delete('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: '找不到要刪除的會員資料',
        result: null,
      })
    }

    res.json({
      code: 200,
      message: '刪除會員成功',
      result: null
    })
  } catch (error) {
    handleError(res, error, '刪除會員失敗')
  }
})

module.exports = router