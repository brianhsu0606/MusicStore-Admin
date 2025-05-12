const express = require('express')
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const { authenticateToken } = require('../middleware/auth')

// #region cost.js
let costList = [
  { id: uuidv4(), name: '店面租金', category: '租金/水電', price: 120000 },
  { id: uuidv4(), name: '店面電費', category: '租金/水電', price: 3243 },
  { id: uuidv4(), name: '店面水費', category: '租金/水電', price: 1086 },
  { id: uuidv4(), name: '職員薪水', category: '人事成本', price: 74000 },
  { id: uuidv4(), name: 'Taylor進貨', category: '進貨成本', price: 164320 },
  { id: uuidv4(), name: '職員勞健保', category: '人事成本', price: 22540 },
  { id: uuidv4(), name: 'Eastman進貨', category: '進貨成本', price: 212000 },
  { id: uuidv4(), name: '弦進貨', category: '進貨成本', price: 27500 },
  { id: uuidv4(), name: '維修冷氣', category: '其他成本', price: 8000 },
]

router.get('/api/costs', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    message: '獲取成本成功',
    result: costList
  })
})

router.post('/api/costs', authenticateToken, (req, res) => {
  const newCost = req.body
  newCost.id = uuidv4()
  costList.push(newCost)

  res.json({
    code: 200,
    message: '新增成本成功',
    result: null
  })
})

router.delete('/api/costs/:id', authenticateToken, (req, res) => {
  const { id } = req.params

  costList = costList.filter(item => item.id !== id)
  res.json({
    code: 200,
    message: '刪除成本成功',
    result: null
  })
})
// #endregion
module.exports = router;
