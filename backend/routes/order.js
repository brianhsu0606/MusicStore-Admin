const express = require('express')
const router = express.Router()
const Order = require('../models/orderModel')
const handleError = require('../utils/handleError')
const { authenticateToken } = require('../middleware/auth')

// 讀取訂單 Read
router.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orderList = await Order.find().sort({ createdAt: -1 })

    res.json({
      code: 200,
      message: '獲取訂單成功',
      result: orderList
    })
  } catch (error) {
    handleError(res, error, '獲取訂單失敗')
  }
})

// 新增訂單 Create
router.post('/api/orders', authenticateToken, async (req, res) => {
  const now = new Date()
  const datePart =
    String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)

  try {
    const newOrder = await Order.create({
      orderNumber: `ORD${datePart}${random}`,
      ...req.body,
    })

    res.json({
      code: 200,
      message: '新增訂單成功',
      result: newOrder
    })
  } catch (error) {
    handleError(res, error, '新增訂單失敗')
  }
})

// 更新訂單 Update
router.put('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedOrder) {
      return res.status(404).json({
        code: 404,
        message: '找不到要更新的訂單資料',
        result: null
      })
    }

    res.json({
      code: 200,
      message: '更新訂單成功',
      result: updatedOrder
    })
  } catch (error) {
    handleError(res, error, '更新訂單失敗')
  }
})

// 刪除訂單 Delete
router.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: '找不到要刪除的訂單資料',
        result: null,
      })
    }

    res.json({
      code: 200,
      message: '刪除訂單成功',
      result: null
    })
  } catch (error) {
    handleError(res, error, '刪除訂單失敗')
  }
})

module.exports = router