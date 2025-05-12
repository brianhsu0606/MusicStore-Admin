const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Member = require('../models/memberModel');

// 讀取會員 Read
router.get('/api/members', authenticateToken, async (req, res) => {
  try {
    const memberList = await Member.find();

    res.json({
      code: 200,
      message: '讀取會員成功',
      result: memberList
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
});

// 新增會員 Create
router.post('/api/members', authenticateToken, async (req, res) => {
  try {
    const newMember = new Member(req.body)
    await newMember.save()

    res.json({
      code: 200,
      message: '新增會員成功',
      result: newMember
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
});

// 更新會員 Update
router.put('/api/members/:_id', authenticateToken, async (req, res) => {
  const { _id } = req.params;
  const updatedData = req.body;

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    );
    if (updatedMember) {
      res.json({
        code: 200,
        message: '更新會員成功',
        result: updatedMember
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '找不到該用戶',
        result: null
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
});

// 刪除會員 Delete
router.delete('/api/members/:_id', authenticateToken, async (req, res) => {
  const { _id } = req.params;

  try {
    const deletedMember = await Member.findByIdAndDelete(_id);

    if (deletedMember) {
      res.json({
        code: 200,
        message: '刪除會員成功',
        result: deletedMember
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '找不到該用戶',
        result: null
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
});

module.exports = router;
