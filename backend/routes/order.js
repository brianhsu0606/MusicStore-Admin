const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const Order = require('../models/orderModel')

// 讀取訂單 Read
router.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orderList = await Order.find().sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: '獲取訂單成功',
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
      orderNumber: `ORD${datePart}${random}`,
      ...req.body,
    });
    await newOrder.save();

    res.json({
      code: 200,
      message: '新增成功',
      result: newOrder
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
});

// 更新訂單 Update
router.put('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({
      code: 200,
      message: '更新訂單成功',
      result: updatedOrder
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
})

// 刪除訂單 Delete
router.delete('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)

    res.json({
      code: 200,
      message: '刪除訂單成功',
      result: null
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
})

module.exports = router;
