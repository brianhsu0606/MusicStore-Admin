const express = require('express')
const router = express.Router()
const Cost = require('../models/costModel')
const handleError = require('../utils/handleError')
const authenticateToken = require('../middleware/authMiddleware')

// 讀取成本 Read
router.get('/api/costs', authenticateToken, async (req, res) => {
  try {
    const costList = await Cost.find().sort({ createdAt: -1 })

    res.json({
      code: 200,
      message: '獲取成本成功',
      result: costList
    })
  } catch (error) {
    handleError(res, error, '獲取成本失敗')
  }
})

// 新增成本 Create
router.post('/api/costs', authenticateToken, async (req, res) => {
  try {
    const newCost = await Cost.create(req.body)

    res.json({
      code: 200,
      message: '新增成本成功',
      result: newCost
    })
  } catch (error) {
    handleError(res, error, '新增成本失敗')
  }
})

// 更新成本 update
router.put('/api/costs/:id', authenticateToken, async (req, res) => {
  try {
    const updatedCost = await Cost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedCost) {
      return res.status(404).json({
        code: 404,
        message: '找不到要更新的成本資料',
        result: null
      })
    }

    res.json({
      code: 200,
      message: '更新成本成功',
      result: updatedCost
    })
  } catch (error) {
    handleError(res, error, '更新成本失敗')
  }
})

// 刪除成本 Delete
router.delete('/api/costs/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Cost.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: '找不到要刪除的成本資料',
        result: null,
      })
    }

    res.json({
      code: 200,
      message: '刪除成本成功',
      result: null
    })
  } catch (error) {
    handleError(res, error, '刪除成本失敗')
  }
})

module.exports = router