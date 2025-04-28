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
  { name: '吊飾', todayBuy: 300, monthBuy: 600, totalBuy: 1800 },
  { name: '吊飾娃', todayBuy: 500, monthBuy: 4000, totalBuy: 6000 },
  { name: 'S娃', todayBuy: 600, monthBuy: 3600, totalBuy: 6000 },
  { name: '立牌', todayBuy: 200, monthBuy: 800, totalBuy: 2000 },
  { name: '扭蛋', todayBuy: 200, monthBuy: 800, totalBuy: 2000 },
  { name: '拍立得', todayBuy: 200, monthBuy: 800, totalBuy: 2000 },
  { name: '撕拉卡', todayBuy: 200, monthBuy: 800, totalBuy: 2000 },
];
app.get('/api/dashboard/table-data', (req, res) => {
  res.json({ code: 200, result: { tableData } });
});
const countData = [
  { name: '電話費', value: 699, icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: '卡費', value: 2599, icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: '房租', value: 10000, icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: 'Youtube', value: 479, icon: 'SuccessFilled', color: 'rgb(239, 68, 68)' },
  { name: 'Spotify', value: 268, icon: 'SuccessFilled', color: 'rgb(127, 225, 122)' },
  { name: '吉伊卡哇', value: 3000, icon: 'StarFilled', color: 'rgb(254, 204, 138)' },
];
app.get('/api/dashboard/count-data', (req, res) => {
  res.json({ code: 200, result: { countData } });
});
const chartData = {
  stockData: {
    date: [
      '2025-3-26', '2025-3-27', '2025-3-28', '2025-3-31',
      '2025-4-1', '2025-4-2', '2025-4-7', '2025-4-8',
    ],
    data: [
      { '台積電': 995, '聯發科': 1540, '鴻海': 167, '廣達': 252 },
      { '台積電': 958, '聯發科': 1485, '鴻海': 160.5, '廣達': 246 },
      { '台積電': 952, '聯發科': 1465, '鴻海': 154, '廣達': 241 },
      { '台積電': 910, '聯發科': 1390, '鴻海': 146, '廣達': 224.5 },
      { '台積電': 944, '聯發科': 1460, '鴻海': 152, '廣達': 234 },
      { '台積電': 942, '聯發科': 1435, '鴻海': 153.5, '廣達': 233 },
      { '台積電': 848, '聯發科': 1295, '鴻海': 138.5, '廣達': 210 },
      { '台積電': 812, '聯發科': 1240, '鴻海': 125, '廣達': 190 },
    ],
  },
  videoData: {},
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
  memberList = memberList.filter(user => user.id != id)
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


app.post('/api/products', (req, res) => {
  const newProduct = req.body
  newProduct.id = Date.now()
  productList.push(newProduct)

  res.json({
    code: 200,
    msg: '新增商品成功',
  })
})

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params
  const updatedProduct = req.body
  const index = productList.findIndex(product => product.id === Number(id))

  if (index !== -1) {
    productList[index] = updatedProduct
    res.json({
      code: 200,
      message: '修改成功',
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '找不到該商品',
    })
  }
})

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params
  productList = productList.filter(product => product.id != id)
  res.json({ code: 200, message: '刪除成功' })
})
// #endregion product.vue
