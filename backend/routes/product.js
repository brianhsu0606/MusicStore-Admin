const express = require('express')
const router = express.Router()
const Product = require('../models/productModel')
const handleError = require('../utils/handleError')
const { authenticateToken } = require('../middleware/auth')

// 讀取商品 Read
router.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const productList = await Product.find().sort({ createdAt: -1 })

    res.json({
      code: 200,
      message: '獲取商品成功',
      result: productList
    })
  } catch (error) {
    handleError(res, error, '獲取商品失敗')
  }
})

// 新增商品 Create
router.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body)

    res.json({
      code: 200,
      message: '新增商品成功',
      result: newProduct
    })
  } catch (error) {
    handleError(res, error, '新增商品失敗')
  }
})

// 更新商品 Update
router.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({
        code: 404,
        message: '找不到要更新的商品資料',
        result: null
      })
    }

    res.json({
      code: 200,
      message: '商品更新成功',
      result: updatedProduct
    })
  } catch (error) {
    handleError(res, error, '更新商品失敗')
  }
})

// 刪除商品 Delete
router.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        message: '找不到要刪除的商品資料',
        result: null,
      })
    }

    res.json({
      code: 200,
      message: '刪除商品成功',
      result: null
    })
  } catch (error) {
    handleError(res, error, '刪除商品失敗')
  }
})

module.exports = router
