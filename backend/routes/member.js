const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Member = require('../models/memberModel');

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
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 新增會員 Create
router.post('/api/members', authenticateToken, async (req, res) => {
  try {
    const newMember = new Member(req.body)
    await newMember.save()

    res.json({
      code: 200,
      message: '新增會員成功',
      result: newMember
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 更新會員 Update
router.put('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({
      code: 200,
      message: '更新會員成功',
      result: updatedMember
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 刪除會員 Delete
router.delete('/api/members/:id', authenticateToken, async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);

    res.json({
      code: 200,
      message: '刪除會員成功',
      result: null
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

module.exports = router;
