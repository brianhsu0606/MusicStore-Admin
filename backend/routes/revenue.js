const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Revenue = require('../models/revenueModel');

// 讀取營業額 Read
router.get('/api/revenues', authenticateToken, async (req, res) => {
  try {
    const revenueList = await Revenue.find().sort({ date: -1 })

    res.json({
      code: 200,
      message: '獲取營收成功',
      result: revenueList
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 新增營業額 Create
router.post('/api/revenues', authenticateToken, async (req, res) => {
  try {
    const newRevenue = new Revenue(req.body)
    await newRevenue.save()

    res.json({
      code: 200,
      message: '新增營業額成功',
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

// 更新營業額 update
router.put('/api/revenues/:id', authenticateToken, async (req, res) => {
  try {
    await Revenue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({
      code: 200,
      message: '更新營業額成功',
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

// 刪除營業額 delete
router.delete('/api/revenues/:id', authenticateToken, async (req, res) => {
  try {
    await Revenue.findByIdAndDelete(req.params.id)

    res.json({
      code: 200,
      message: '刪除當日營業額成功',
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
