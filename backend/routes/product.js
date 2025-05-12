const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/auth')
const Product = require('../models/productModel')

// 讀取商品 Read
router.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const productList = await Product.find()

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
router.put('/api/products/:_id', authenticateToken, async (req, res) => {
  const { _id } = req.params
  const updatedData = req.body

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      updatedData,
      { new: true }
    )
    if (updatedProduct) {
      res.json({
        code: 200,
        message: '更新商品成功',
        result: updatedProduct
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '找不到該商品',
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

// 刪除商品 Delete
router.delete('/api/products/:_id', authenticateToken, async (req, res) => {
  const { _id } = req.params

  try {
    const deletedProduct = await Product.findByIdAndDelete(_id)

    if (deletedProduct) {
      res.json({
        code: 200,
        message: '刪除商品成功',
        result: deletedProduct
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '找不到該商品',
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
