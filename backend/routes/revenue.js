const express = require('express')
const router = express.Router()
const Revenue = require('../models/revenueModel')
const handleError = require('../utils/handleError')
const authenticateToken = require('../middleware/authMiddleware')

// 讀取營業額 Read
router.get('/api/revenues', authenticateToken, async (req, res) => {
  try {
    const revenueList = await Revenue.find().sort({ createdAt: -1 })

    res.json({
      code: 200,
      message: '獲取營業額成功',
      result: revenueList
    })
  } catch (error) {
    handleError(res, error, '獲取營業額失敗')
  }
})

// 新增營業額 Create
router.post('/api/revenues', authenticateToken, async (req, res) => {
  try {
    const newRevenue = await Revenue.create(req.body)

    res.json({
      code: 200,
      message: '新增營業額成功',
      result: newRevenue
    })
  } catch (error) {
    handleError(res, error, '新增營業額失敗')
  }
})

// 更新營業額 update
router.put('/api/revenues/:id', authenticateToken, async (req, res) => {
  try {
    const updatedRevenue = await Revenue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedRevenue) {
      return res.status(404).json({
        code: 404,
        message: '找不到要更新的營業額資料',
        result: null
      })
    }

    res.json({
      code: 200,
      message: '更新營業額成功',
      result: updatedRevenue
    })
  } catch (error) {
    handleError(res, error, '更新營業額失敗')
  }
})

// 刪除營業額 delete
router.delete('/api/revenues/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Revenue.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: '找不到要刪除的營業額資料',
        result: null,
      })
    }

    res.json({
      code: 200,
      message: '刪除營業額成功',
      result: null
    })
  } catch (error) {
    handleError(res, error, '刪除營業額失敗')
  }
})

module.exports = router