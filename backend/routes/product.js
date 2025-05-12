const express = require('express')
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const { authenticateToken } = require('../middleware/auth')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
router.use('/images', express.static(path.join(__dirname, 'images')))


// #region product.js
let productList = [
  { id: uuidv4(), name: 'Collings OM2H', price: 238000, quantity: 1, category: '木吉他', imageUrl: '/images/om2h.jpg' },
  { id: uuidv4(), name: 'Lakewood M32C', price: 118000, quantity: 2, category: '木吉他', imageUrl: '/images/m32c.jpg' },
  { id: uuidv4(), name: 'Maton EBG808TE', price: 84800, quantity: 4, category: '木吉他', imageUrl: '/images/808te.jpg' },
  { id: uuidv4(), name: 'AER / Alpha Plus 50瓦', price: 42000, quantity: 3, category: '音箱', imageUrl: '/images/aer.jpg' },
  { id: uuidv4(), name: 'PRS S2 Custom 24-08 Black Amber', price: 90300, quantity: 3, category: '電吉他', imageUrl: '/images/prs.jpg' },
  { id: uuidv4(), name: 'Lowden F32', price: 164000, quantity: 2, category: '木吉他', imageUrl: '/images/lowdenf32.jpg' },
  { id: uuidv4(), name: 'PRS John Mayer SE Silver Sky', price: 33500, quantity: 5, category: '電吉他', imageUrl: '/images/prs2.jpg' },
  { id: uuidv4(), name: 'G7th Performance 3 銀色', price: 1590, quantity: 10, category: '配件', imageUrl: '/images/g7p3silver.jpg' },
  { id: uuidv4(), name: 'G7th Performance 3 金色', price: 1800, quantity: 6, category: '配件', imageUrl: '/images/g7p3golden.jpg' },
  { id: uuidv4(), name: 'G7th Heritage 銀色', price: 5800, quantity: 3, category: '配件', imageUrl: '/images/g7heritage.jpg' },
]

router.get('/api/products', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    msg: '獲得商品成功',
    result: productList
  })
})


// 設定圖片儲存位置與檔名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/images')) // 圖片儲存資料夾
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}${ext}`
    cb(null, filename)
  }
})
const upload = multer({ storage })

// 圖片上傳 API
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '沒有上傳檔案' })
  }

  const imageUrl = `/images/${req.file.filename}`
  res.json({ imageUrl })
})

// Create
router.post('/api/products', authenticateToken, (req, res) => {
  const newProduct = req.body
  newProduct.id = uuidv4()
  productList.push(newProduct)

  res.json({
    code: 200,
    message: '新增商品成功',
    result: null
  })
})

// Update
router.put('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const updatedProduct = req.body
  const index = productList.findIndex(item => item.id === id)

  if (index !== -1) {
    productList[index] = updatedProduct
    res.json({
      code: 200,
      message: '修改成功',
      result: null
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '找不到該商品',
      result: null
    })
  }
})

// delete
router.delete('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  productList = productList.filter(item => item.id !== id)
  res.json({
    code: 200,
    message: '刪除成功',
    result: null
  })
})
// #endregion
module.exports = router;
