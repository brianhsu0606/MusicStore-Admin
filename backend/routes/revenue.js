const express = require('express')
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const { authenticateToken } = require('../middleware/auth')

// #region revenue.js
let revenueList = [
  { id: uuidv4(), date: '2025-5-5', price: 76880 },
  { id: uuidv4(), date: '2025-5-10', price: 162330 },
  { id: uuidv4(), date: '2025-5-15', price: 82405 },
  { id: uuidv4(), date: '2025-5-20', price: 64400 },
  { id: uuidv4(), date: '2025-5-25', price: 132420 },
  { id: uuidv4(), date: '2025-5-30', price: 246650 },
]

router.get('/api/revenues', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    message: '獲取營業額成功',
    result: revenueList
  })
})

router.post('/api/revenues', authenticateToken, (req, res) => {
  const newRevenue = req.body
  newRevenue.id = uuidv4()
  revenueList.push(newRevenue)

  res.json({
    code: 200,
    message: '新增營業額成功',
    result: null
  })
})

router.delete('/api/revenues/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  revenueList = revenueList.filter(item => item.id !== id)

  res.json({
    code: 200,
    message: '刪除營業額成功',
    result: null
  })
})
// #endregion
module.exports = router;
