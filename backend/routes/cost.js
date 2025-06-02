const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/auth')
const Cost = require('../models/costModel')

// 讀取成本 Read
router.get('/api/costs', authenticateToken, async (req, res) => {
  try {
    const costList = await Cost.find().sort({ date: -1 })
    res.json({
      code: 200,
      message: '獲取成本成功',
      result: costList
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 新增成本 Create
router.post('/api/costs', authenticateToken, async (req, res) => {
  try {
    const newCost = new Cost(req.body)
    await newCost.save()
    res.json({
      code: 200,
      message: '新增成本成功',
      result: null
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

router.put('/api/costs/:id', authenticateToken, async (req, res) => {
  try {
    await Cost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({
      code: 200,
      message: '編輯成本成功',
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

// 刪除成本 Delete
router.delete('/api/costs/:id', authenticateToken, async (req, res) => {
  try {
    await Cost.findByIdAndDelete(req.params.id)

    res.json({
      code: 200,
      message: '刪除成本成功',
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
