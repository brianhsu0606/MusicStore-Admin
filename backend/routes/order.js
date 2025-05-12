const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const Order = require('../models/orderModel')

// 讀取訂單 Read
router.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orderList = await Order.find()

    res.json({
      code: 200,
      msg: '訂單獲取成功',
      result: orderList
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
})

// 新增訂單 Create
router.post('/api/orders', authenticateToken, async (req, res) => {
  const now = new Date();
  const datePart =
    String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);

  try {
    const newOrder = new Order({
      ...req.body,
      orderNumber: `ORD${datePart}${random}`
    });
    await newOrder.save();

    res.json({
      code: 200,
      message: '新增成功',
      result: newOrder
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
});

// 更新訂單 Update
router.put('/api/orders/:_id', authenticateToken, async (req, res) => {
  const { _id } = req.params
  const updatedData = req.body

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    )

    if (updatedOrder) {
      res.json({
        code: 200,
        message: '更改成功',
        result: updatedOrder
      })
    } else {
      res.status(404).json({
        code: 404,
        message: '找不到該訂單',
        result: null
      })
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
})

// 刪除訂單 Delete
router.delete('/api/orders/:_id', authenticateToken, async (req, res) => {
  const { _id } = req.params

  try {
    const deletedOrder = await Order.findByIdAndDelete(_id)

    if (deletedOrder) {
      res.json({
        code: 200,
        message: '刪除訂單成功',
        result: deletedOrder
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '找不到該訂單',
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
})

module.exports = router;
