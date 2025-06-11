const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/auth')
const Product = require('../models/productModel')

// 讀取商品 Read
router.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const productList = await Product.find().sort({ createdAt: -1 })

    res.json({
      code: 200,
      msg: '獲得商品成功',
      result: productList
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 新增商品 Create
router.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const newProduct = new Product(req.body)
    await newProduct.save()

    res.json({
      code: 200,
      msg: '新增商品成功',
      result: newProduct
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 更新商品 Update
router.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({
      code: 200,
      message: '商品更新成功',
      result: updatedProduct
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    });
  }
})

// 刪除商品 Delete
router.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)

    res.json({
      code: 200,
      message: '刪除商品成功',
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
