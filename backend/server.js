const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());  // 啟用 CORS，允許來自前端的請求
app.use(express.json());  // 解析 JSON 請求內容

app.use('/images', express.static(path.join(__dirname, 'images')))



// 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行中，請訪問 http://localhost:${PORT}`);
});

const USERS_FILE = path.join(__dirname, 'users.json'); // 儲存使用者資料的檔案

// 讀取使用者資料
const loadUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }
  return [];
};

// #region Login.vue
app.post('/api/register', (req, res) => {
  const { name, username, password } = req.body;

  const users = loadUsers();
  if (users.some(user => user.username === username)) {
    return res.status(400).json({
      code: 400,
      msg: '帳號已存在',
      result: {},
    });
  }

  users.push({
    username,
    password,
    profile: {
      name,
      gender: '',
      birth: '',
      email: '',
      avatar: 'avatar1.jpeg'
    }
  });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.json({
    code: 200,
    msg: '註冊成功',
    result: {},
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = 'mock-token-' + user.username;
    return res.json({
      code: 200,
      msg: '登入成功',
      result: {
        token,
      }
    });
  }
  return res.status(400).json({
    code: 400,
    msg: '帳號或密碼錯誤',
    result: {},
  });
});
// #endregion Login.vue

// #region User.vue
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization;
  const users = loadUsers();
  const user = users.find(u => 'mock-token-' + u.username === token);

  if (!user) {
    return res.status(401).json({ code: 401, msg: '未授權' });
  }

  return res.json({ code: 200, result: user.profile || {} });
});


app.put('/api/profile', (req, res) => {
  const token = req.headers.authorization;
  const users = loadUsers();
  const userIndex = users.findIndex(u => 'mock-token-' + u.username === token);

  if (userIndex === -1) {
    return res.status(401).json({ code: 401, msg: '未授權' });
  }

  // 更新 profile 欄位
  const updatedProfile = req.body;
  users[userIndex].profile = {
    ...users[userIndex].profile,
    ...updatedProfile
  };

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.json({ code: 200, msg: '更新成功' });
});
// #endregion User.vue

// #region home.vue
const tableData = [
  { name: 'Veelah', monthlyStockIn: 20, monthlySales: 13 },
  { name: 'Eastman', monthlyStockIn: 60, monthlySales: 11 },
  { name: 'Maton', monthlyStockIn: 10, monthlySales: 4 },
  { name: 'Lakewood', monthlyStockIn: 4, monthlySales: 2 },
  { name: 'Fender', monthlyStockIn: 6, monthlySales: 3 },
  { name: 'PRS', monthlyStockIn: 10, monthlySales: 5 },
  { name: 'G7th 移調夾', monthlyStockIn: 30, monthlySales: 11 },
];
app.get('/api/dashboard/table-data', (req, res) => {
  res.json({ code: 200, result: { tableData } });
});

const countData = [
  { name: '店面租金', value: 100000, icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: '人事成本', value: 120000, icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: '本月其餘成本', value: 24300, icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: '本月進貨成本', value: 425000, icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: '本月銷售總額', value: 1018850, icon: 'Money', color: 'rgb(127, 225, 122)' },
  { name: '本月淨利潤', value: 449550, icon: 'SuccessFilled', color: 'rgb(239, 68, 68)' },
];
app.get('/api/dashboard/count-data', (req, res) => {
  res.json({ code: 200, result: { countData } });
});

const chartData = {
  salesData: {
    date: [
      '2024-10', '2024-11', '2024-12', '2025-1',
      '2025-2', '2025-3', '2025-4', '2025-5',
    ],
    data: [
      { 'Eastman': 8, 'Veelah': 18, 'Fender': 8, 'PRS': 4 },
      { 'Eastman': 6, 'Veelah': 15, 'Fender': 10, 'PRS': 6 },
      { 'Eastman': 11, 'Veelah': 21, 'Fender': 12, 'PRS': 8 },
      { 'Eastman': 15, 'Veelah': 13, 'Fender': 6, 'PRS': 12 },
      { 'Eastman': 4, 'Veelah': 12, 'Fender': 3, 'PRS': 3 },
      { 'Eastman': 7, 'Veelah': 16, 'Fender': 2, 'PRS': 5 },
      { 'Eastman': 6, 'Veelah': 23, 'Fender': 5, 'PRS': 2 },
      { 'Eastman': 12, 'Veelah': 25, 'Fender': 7, 'PRS': 7 },
    ],
  },
};
app.get('/api/dashboard/chart-data', (req, res) => {
  res.json({ code: 200, result: chartData });
});
// #endregion home.vue

// #region member.vue
let memberList = [
  { id: 1, name: '小明', age: 25, gender: '男', birth: '1998-01-01', addr: '台北' },
  { id: 2, name: '小美', age: 28, gender: '女', birth: '1995-04-12', addr: '新竹' },
  { id: 3, name: '阿強', age: 32, gender: '男', birth: '1992-08-25', addr: '台中' },
  { id: 4, name: '小花', age: 22, gender: '女', birth: '2001-07-15', addr: '高雄' },
  { id: 5, name: '阿文', age: 30, gender: '男', birth: '1993-12-05', addr: '台南' },
  { id: 6, name: '小志', age: 29, gender: '男', birth: '1994-03-11', addr: '新北' },
  { id: 7, name: '美玲', age: 26, gender: '女', birth: '1997-06-20', addr: '台中' },
  { id: 8, name: '大雄', age: 31, gender: '男', birth: '1992-09-30', addr: '桃園' },
  { id: 9, name: '靜香', age: 27, gender: '女', birth: '1996-11-10', addr: '新竹' },
  { id: 10, name: '小偉', age: 24, gender: '男', birth: '1999-01-18', addr: '台北' },
  { id: 11, name: '阿珍', age: 33, gender: '女', birth: '1990-10-22', addr: '高雄' },
  { id: 12, name: '志明', age: 35, gender: '男', birth: '1989-04-05', addr: '台南' },
  { id: 13, name: '小拉', age: 21, gender: '女', birth: '2003-02-14', addr: '台中' },
  { id: 14, name: '大明', age: 29, gender: '男', birth: '1994-07-07', addr: '基隆' },
  { id: 15, name: '麗華', age: 30, gender: '女', birth: '1993-03-09', addr: '南投' },
  { id: 16, name: '阿德', age: 34, gender: '男', birth: '1990-08-03', addr: '嘉義' },
  { id: 17, name: '婉君', age: 23, gender: '女', birth: '2000-06-30', addr: '花蓮' },
  { id: 18, name: '志強', age: 27, gender: '男', birth: '1996-12-12', addr: '台北' },
  { id: 19, name: '小英', age: 26, gender: '女', birth: '1997-09-19', addr: '宜蘭' },
  { id: 20, name: '阿凱', age: 31, gender: '男', birth: '1992-05-23', addr: '新竹' },
  { id: 21, name: '小宏', age: 28, gender: '男', birth: '1995-02-10', addr: '台中' },
  { id: 22, name: '小芳', age: 24, gender: '女', birth: '1999-08-08', addr: '台南' },
  { id: 23, name: '志玲', age: 32, gender: '女', birth: '1992-01-15', addr: '台北' },
  { id: 24, name: '阿銘', age: 30, gender: '男', birth: '1993-06-03', addr: '新北' },
  { id: 25, name: '佳佳', age: 26, gender: '女', birth: '1997-03-28', addr: '花蓮' },
  { id: 26, name: '文傑', age: 33, gender: '男', birth: '1990-09-17', addr: '基隆' },
  { id: 27, name: '小翠', age: 22, gender: '女', birth: '2001-11-05', addr: '高雄' },
  { id: 28, name: '大志', age: 35, gender: '男', birth: '1989-12-22', addr: '台中' },
  { id: 29, name: '欣怡', age: 29, gender: '女', birth: '1994-05-10', addr: '新竹' },
  { id: 30, name: '志豪', age: 27, gender: '男', birth: '1996-07-19', addr: '台南' },
  { id: 31, name: '佩君', age: 25, gender: '女', birth: '1998-10-01', addr: '桃園' },
  { id: 32, name: '阿宏', age: 34, gender: '男', birth: '1989-06-16', addr: '台東' },
  { id: 33, name: '小倩', age: 28, gender: '女', birth: '1995-01-12', addr: '嘉義' },
  { id: 34, name: '建志', age: 31, gender: '男', birth: '1992-03-03', addr: '台北' },
  { id: 35, name: '美華', age: 30, gender: '女', birth: '1993-09-30', addr: '高雄' },
  { id: 36, name: '阿仁', age: 33, gender: '男', birth: '1990-11-11', addr: '屏東' },
  { id: 37, name: '小晴', age: 21, gender: '女', birth: '2002-04-17', addr: '新北' },
  { id: 38, name: '信志', age: 29, gender: '男', birth: '1994-02-25', addr: '苗栗' },
  { id: 39, name: '慧君', age: 26, gender: '女', birth: '1997-07-04', addr: '宜蘭' },
  { id: 40, name: '阿良', age: 32, gender: '男', birth: '1991-08-28', addr: '新竹' },
]

// Read
app.get('/api/members', (req, res) => {
  res.json({
    code: 200,
    message: '查詢成功',
    result: {
      memberList
    }
  })
})

// Create
app.post('/api/members', (req, res) => {
  const newMember = req.body
  newMember.id = Date.now()
  memberList.push(newMember)
  res.json({ code: 200, message: '新增成功' })
})

// Delete
app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params
  memberList = memberList.filter(user => user.id !== Number(id))
  res.json({ code: 200, message: '刪除成功' })
})

// Update
app.put('/api/members/:id', (req, res) => {
  const { id } = req.params
  const updatedUser = req.body
  const index = memberList.findIndex(user => user.id === Number(id))

  if (index !== -1) {
    memberList[index] = updatedUser
    res.json({
      code: 200,
      message: '修改成功',
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '找不到該用戶',
    })
  }
})
// #endregion member.vue

// #region product.vue
let productList = [
  { id: 1, name: 'Collings OM2H', price: 238000, quantity: 1, category: '木吉他', imageUrl: '/images/om2h.jpg' },
  { id: 2, name: 'Lakewood M32C', price: 118000, quantity: 2, category: '木吉他', imageUrl: '/images/m32c.jpg' },
  { id: 3, name: 'Maton EBG808TE', price: 84800, quantity: 4, category: '木吉他', imageUrl: '/images/808te.jpg' },
  { id: 4, name: 'AER / Alpha Plus 50瓦', price: 42000, quantity: 3, category: '音箱', imageUrl: '/images/aer.jpg' },
  { id: 5, name: 'PRS S2 Custom 24-08 Black Amber', price: 90300, quantity: 3, category: '電吉他', imageUrl: '/images/prs.jpg' },
  { id: 6, name: 'Lowden F32', price: 164000, quantity: 2, category: '木吉他', imageUrl: '/images/lowdenf32.jpg' },
  { id: 7, name: 'PRS John Mayer SE Silver Sky', price: 33500, quantity: 5, category: '電吉他', imageUrl: '/images/prs2.jpg' },
  { id: 8, name: 'G7th Performance 3 銀色', price: 1590, quantity: 10, category: '配件', imageUrl: '/images/g7p3silver.jpg' },
  { id: 9, name: 'G7th Performance 3 金色', price: 1800, quantity: 6, category: '配件', imageUrl: '/images/g7p3golden.jpg' },
  { id: 10, name: 'G7th Heritage 銀色', price: 5800, quantity: 3, category: '配件', imageUrl: '/images/g7heritage.jpg' },
]

app.get('/api/products', (req, res) => {
  res.json({
    code: 200,
    msg: '獲得商品成功',
    result: {
      productList
    }
  })
})

const multer = require('multer')

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
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '沒有上傳檔案' })
  }

  const imageUrl = `/images/${req.file.filename}`
  res.json({ imageUrl })
})

// Create
app.post('/api/products', (req, res) => {
  const newProduct = req.body
  newProduct.id = Date.now()
  productList.push(newProduct)

  res.json({
    code: 200,
    msg: '新增商品成功',
  })
})

// Update
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params
  const updatedProduct = req.body
  const index = productList.findIndex(item => item.id === Number(id))

  if (index !== -1) {
    productList[index] = updatedProduct
    res.json({
      code: 200,
      msg: '修改成功',
    })
  } else {
    res.status(404).json({
      code: 404,
      msg: '找不到該商品',
    })
  }
})

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params
  productList = productList.filter(item => item.id !== Number(id))
  res.json({ code: 200, message: '刪除成功' })
})
// #endregion product.vue

// #region OrderManagement.vue
let orderList = [
  { id: 1, orderNumber: 'ORD2411135839', member: '小明', items: 'Lakewood M32', status: 'shipped' },
  { id: 2, orderNumber: 'ORD2412254276', member: '小美', items: 'G7th Performance 3 金色', status: 'shipped' },
  { id: 3, orderNumber: 'ORD2502072521', member: '小華', items: 'Maton EBG808TE', status: 'processing' },
  { id: 4, orderNumber: 'ORD2503137490', member: '阿明', items: 'Eastman PCH1', status: 'completed' },
  { id: 5, orderNumber: 'ORD2503316843', member: '大雄', items: 'G7th Performance 3 銀色', status: 'completed' },
  { id: 6, orderNumber: 'ORD2504115877', member: '小志', items: 'Eastman PCH1', status: 'processing' },
]

// Read
app.get('/api/orders', (req, res) => {
  res.json({
    code: 200,
    msg: '訂單獲取成功',
    result: {
      orderList
    }
  })
})

// Create
app.post('/api/orders', (req, res) => {
  const now = new Date()
  const datePart = String(now.getFullYear()).slice(2) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)
  const newOrder = {
    ...req.body,
    id: Date.now(),
    orderNumber: `ORD${datePart}${random}`,
  }

  orderList.push(newOrder)

  res.json({
    code: 200,
    msg: '新增成功',
    result: {}
  })
})

// Update
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params
  const updatedOrder = req.body
  const index = orderList.findIndex(item => item.id === Number(id))

  if (index !== -1) {
    orderList[index] = updatedOrder
    res.json({
      code: 200,
      msg: '更改成功',
      result: {}
    })
  } else {
    res.status(404).json({
      code: 404,
      msg: '更改失敗',
      result: {}
    })
  }
})

// Delete
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params
  orderList = orderList.filter(item => item.id !== Number(id))

  res.json({
    code: 200,
    msg: '訂單刪除成功',
    result: {}
  })
})
// #endregion OrderManagement.vue
