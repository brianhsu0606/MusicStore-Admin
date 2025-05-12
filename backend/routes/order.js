const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../middleware/auth')


// #region order.js
let orderList = [
  { id: uuidv4(), orderNumber: 'ORD2411135839', createdAt: '2024-11-13', member: '小明', items: 'Lakewood M32', status: 'shipped' },
  { id: uuidv4(), orderNumber: 'ORD2412254276', createdAt: '2024-12-25', member: '小美', items: 'G7th Performance 3 金色', status: 'shipped' },
  { id: uuidv4(), orderNumber: 'ORD2502072521', createdAt: '2025-02-07', member: '小華', items: 'Maton EBG808TE', status: 'processing' },
  { id: uuidv4(), orderNumber: 'ORD2503137490', createdAt: '2025-03-13', member: '阿明', items: 'Eastman PCH1', status: 'completed' },
  { id: uuidv4(), orderNumber: 'ORD2503316843', createdAt: '2025-03-31', member: '大雄', items: 'G7th Performance 3 銀色', status: 'completed' },
  { id: uuidv4(), orderNumber: 'ORD2504115877', createdAt: '2025-04-11', member: '小志', items: 'Eastman PCH1', status: 'processing' },
  { id: uuidv4(), orderNumber: 'ORD2504151298', createdAt: '2025-04-15', member: '小美', items: 'Maton EBG808TE', status: 'processing' },
  { id: uuidv4(), orderNumber: 'ORD2504186457', createdAt: '2025-04-18', member: '阿信', items: 'Lakewood M32', status: 'shipped' },
  { id: uuidv4(), orderNumber: 'ORD2504198732', createdAt: '2025-04-19', member: '小明', items: 'G7th Performance 3 銀色', status: 'completed' },
  { id: uuidv4(), orderNumber: 'ORD2504209031', createdAt: '2025-04-20', member: '阿亮', items: 'Eastman PCH1', status: 'processing' },
  { id: uuidv4(), orderNumber: 'ORD2504214325', createdAt: '2025-04-21', member: '小志', items: 'Lakewood M32', status: 'shipped' },
  { id: uuidv4(), orderNumber: 'ORD2504221239', createdAt: '2025-04-22', member: '小華', items: 'Maton EBG808TE', status: 'completed' },
  { id: uuidv4(), orderNumber: 'ORD2504239652', createdAt: '2025-04-23', member: '大雄', items: 'G7th Performance 3 金色', status: 'shipped' },
  { id: uuidv4(), orderNumber: 'ORD2504247763', createdAt: '2025-04-24', member: '阿明', items: 'Lakewood M32', status: 'processing' },
  { id: uuidv4(), orderNumber: 'ORD2504255509', createdAt: '2025-04-25', member: '小美', items: 'Maton EBG808TE', status: 'completed' },
  { id: uuidv4(), orderNumber: 'ORD2504266831', createdAt: '2025-04-26', member: '小志', items: 'G7th Performance 3 銀色', status: 'shipped' },
  { id: uuidv4(), orderNumber: 'ORD2504272087', createdAt: '2025-04-27', member: '小明', items: 'Eastman PCH1', status: 'processing' },
  { id: uuidv4(), orderNumber: 'ORD2504289312', createdAt: '2025-04-28', member: '阿信', items: 'Lakewood M32', status: 'completed' },
  { id: uuidv4(), orderNumber: 'ORD2504293489', createdAt: '2025-04-29', member: '小華', items: 'G7th Performance 3 金色', status: 'processing' },
  { id: uuidv4(), orderNumber: 'ORD2504307930', createdAt: '2025-04-30', member: '小美', items: 'Maton EBG808TE', status: 'shipped' },
]

// Read
router.get('/api/orders', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    msg: '訂單獲取成功',
    result: orderList
  })
})

// Create
router.post('/api/orders', authenticateToken, (req, res) => {
  const now = new Date()
  const datePart = String(now.getFullYear()).slice(2) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)
  const newOrder = {
    ...req.body,
    id: uuidv4(),
    orderNumber: `ORD${datePart}${random}`,
  }

  orderList.push(newOrder)

  res.json({
    code: 200,
    message: '新增成功',
    result: null
  })
})

// Update
router.put('/api/orders/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const updatedOrder = req.body
  const index = orderList.findIndex(item => item.id === id)

  if (index !== -1) {
    orderList[index] = updatedOrder
    res.json({
      code: 200,
      message: '更改成功',
      result: null
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '更改失敗',
      result: null
    })
  }
})

// Delete
router.delete('/api/orders/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  orderList = orderList.filter(item => item.id !== id)

  res.json({
    code: 200,
    message: '訂單刪除成功',
    result: null
  })
})
// #endregion

module.exports = router;
