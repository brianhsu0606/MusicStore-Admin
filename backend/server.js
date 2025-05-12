const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');

// const bcrypt = require('bcryptjs');
// const SALT_ROUNDS = 10;

// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'mysecretkey123'; // 之後可以放在 .env 裡

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')))

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行中，請訪問 http://localhost:${PORT}`);
});

// const USERS_FILE = path.join(__dirname, 'users.json');
// const loadUsers = () => {
//   if (fs.existsSync(USERS_FILE)) {
//     return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
//   }
//   return [];
// };


// const memberRouter = require('./routes/member');
// app.use(memberRouter);

app.use(require('./routes/auth'));
app.use(require('./routes/profile'));

app.use(require('./routes/member'));
app.use(require('./routes/product'));
app.use(require('./routes/order'));

app.use(require('./routes/cost'));
app.use(require('./routes/user'));
app.use(require('./routes/revenue'));

// #region home.js
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
  res.json({
    code: 200,
    message: '表格資料獲得成功',
    result: tableData
  });
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
  res.json({
    code: 200,
    message: '算數資料獲得成功',
    result: countData
  });
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
  res.json({
    code: 200,
    message: '算數資料獲得成功',
    result: chartData
  });
});
// #endregion home.vue

// #region 備用程式碼

// token
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

//   if (!token) {
//     return res.status(401).json({ code: 401, message: '未授權，缺少 token' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, userData) => {
//     if (err) {
//       return res.status(403).json({ code: 403, message: '無效的 token' });
//     }

//     req.user = userData; // 存入 req.user 以便後續使用
//     next();
//   });
// }


// // #region auth.js
// app.post('/api/register', async (req, res) => {
//   const { name, username, password, role } = req.body;
//   const users = loadUsers();

//   if (users.some(user => user.username === username)) {
//     return res.status(400).json({
//       code: 400,
//       message: '帳號已存在',
//       result: null,
//     });
//   }

//   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

//   users.push({
//     id: uuidv4(),
//     username,
//     password: hashedPassword,
//     profile: {
//       role,
//       name,
//       gender: '',
//       birth: '',
//       email: '',
//       avatar: 'avatar1.jpeg'
//     }
//   });

//   fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

//   return res.json({
//     code: 200,
//     message: '註冊成功',
//     result: null,
//   });
// });

// // 登入 login
// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   const users = loadUsers();
//   const user = users.find(u => u.username === username);

//   if (!user) {
//     return res.status(400).json({
//       code: 400,
//       message: '帳號或密碼錯誤',
//       result: null,
//     });
//   }

//   // 用 bcrypt 比對密碼
//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return res.status(400).json({
//       code: 400,
//       message: '帳號或密碼錯誤',
//       result: null,
//     });
//   }

//   const token = jwt.sign(
//     {
//       id: user.id,
//       username: user.username,
//       role: user.profile.role
//     },
//     JWT_SECRET,
//     { expiresIn: '2h' } // token 有效時間為 2 小時
//   );

//   return res.json({
//     code: 200,
//     message: '登入成功',
//     result: {
//       token,
//     }
//   });
// });
// // #endregion

// // #region profile.js
// app.get('/api/profile', authenticateToken, (req, res) => {

//   const users = loadUsers();

//   const user = users.find(u => u.id === req.user.id); // 用 JWT 中的 id 找用戶

//   if (!user) {
//     return res.status(404).json({ code: 404, message: '用戶不存在' });
//   }

//   return res.json({
//     code: 200,
//     message: '取得用戶資訊成功',
//     result: {
//       id: user.id,
//       ...user.profile
//     }
//   });
// });

// app.put('/api/profile', authenticateToken, (req, res) => {

//   const users = loadUsers();

//   const userIndex = users.find(u => u.id === req.user.id); // 用 JWT 中的 id 找用戶


//   if (userIndex === -1) {
//     return res.status(404).json({ code: 404, message: '用戶不存在' });

//   }

//   // 更新 profile 欄位
//   const updatedProfile = req.body;
//   users[userIndex].profile = {
//     ...users[userIndex].profile,
//     ...updatedProfile
//   };

//   fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

//   return res.json({
//     code: 200,
//     message: '更新成功',
//     result: null
//   });
// });
// // #endregion



// // #region member.js
// let memberList = [
//   { id: uuidv4(), name: '小明', age: 25, gender: '男', birth: '1998-01-01', addr: '台北' },
//   { id: uuidv4(), name: '小美', age: 28, gender: '女', birth: '1995-04-12', addr: '新竹' },
//   { id: uuidv4(), name: '阿強', age: 32, gender: '男', birth: '1992-08-25', addr: '台中' },
//   { id: uuidv4(), name: '小花', age: 22, gender: '女', birth: '2001-07-15', addr: '高雄' },
//   { id: uuidv4(), name: '阿文', age: 30, gender: '男', birth: '1993-12-05', addr: '台南' },
//   { id: uuidv4(), name: '小志', age: 29, gender: '男', birth: '1994-03-11', addr: '新北' },
//   { id: uuidv4(), name: '美玲', age: 26, gender: '女', birth: '1997-06-20', addr: '台中' },
//   { id: uuidv4(), name: '大雄', age: 31, gender: '男', birth: '1992-09-30', addr: '桃園' },
//   { id: uuidv4(), name: '靜香', age: 27, gender: '女', birth: '1996-11-10', addr: '新竹' },
//   { id: uuidv4(), name: '小偉', age: 24, gender: '男', birth: '1999-01-18', addr: '台北' },
//   { id: uuidv4(), name: '阿珍', age: 33, gender: '女', birth: '1990-10-22', addr: '高雄' },
//   { id: uuidv4(), name: '志明', age: 35, gender: '男', birth: '1989-04-05', addr: '台南' },
//   { id: uuidv4(), name: '小拉', age: 21, gender: '女', birth: '2003-02-14', addr: '台中' },
//   { id: uuidv4(), name: '大明', age: 29, gender: '男', birth: '1994-07-07', addr: '基隆' },
//   { id: uuidv4(), name: '麗華', age: 30, gender: '女', birth: '1993-03-09', addr: '南投' },
//   { id: uuidv4(), name: '阿德', age: 34, gender: '男', birth: '1990-08-03', addr: '嘉義' },
//   { id: uuidv4(), name: '婉君', age: 23, gender: '女', birth: '2000-06-30', addr: '花蓮' },
//   { id: uuidv4(), name: '志強', age: 27, gender: '男', birth: '1996-12-12', addr: '台北' },
//   { id: uuidv4(), name: '小英', age: 26, gender: '女', birth: '1997-09-19', addr: '宜蘭' },
//   { id: uuidv4(), name: '阿凱', age: 31, gender: '男', birth: '1992-05-23', addr: '新竹' },
//   { id: uuidv4(), name: '小宏', age: 28, gender: '男', birth: '1995-02-10', addr: '台中' },
//   { id: uuidv4(), name: '小芳', age: 24, gender: '女', birth: '1999-08-08', addr: '台南' },
//   { id: uuidv4(), name: '志玲', age: 32, gender: '女', birth: '1992-01-15', addr: '台北' },
//   { id: uuidv4(), name: '阿銘', age: 30, gender: '男', birth: '1993-06-03', addr: '新北' },
//   { id: uuidv4(), name: '佳佳', age: 26, gender: '女', birth: '1997-03-28', addr: '花蓮' },
//   { id: uuidv4(), name: '文傑', age: 33, gender: '男', birth: '1990-09-17', addr: '基隆' },
//   { id: uuidv4(), name: '小翠', age: 22, gender: '女', birth: '2001-11-05', addr: '高雄' },
//   { id: uuidv4(), name: '大志', age: 35, gender: '男', birth: '1989-12-22', addr: '台中' },
//   { id: uuidv4(), name: '欣怡', age: 29, gender: '女', birth: '1994-05-10', addr: '新竹' },
//   { id: uuidv4(), name: '志豪', age: 27, gender: '男', birth: '1996-07-19', addr: '台南' },
//   { id: uuidv4(), name: '佩君', age: 25, gender: '女', birth: '1998-10-01', addr: '桃園' },
//   { id: uuidv4(), name: '阿宏', age: 34, gender: '男', birth: '1989-06-16', addr: '台東' },
//   { id: uuidv4(), name: '小倩', age: 28, gender: '女', birth: '1995-01-12', addr: '嘉義' },
//   { id: uuidv4(), name: '建志', age: 31, gender: '男', birth: '1992-03-03', addr: '台北' },
//   { id: uuidv4(), name: '美華', age: 30, gender: '女', birth: '1993-09-30', addr: '高雄' },
//   { id: uuidv4(), name: '阿仁', age: 33, gender: '男', birth: '1990-11-11', addr: '屏東' },
//   { id: uuidv4(), name: '小晴', age: 21, gender: '女', birth: '2002-04-17', addr: '新北' },
//   { id: uuidv4(), name: '信志', age: 29, gender: '男', birth: '1994-02-25', addr: '苗栗' },
//   { id: uuidv4(), name: '慧君', age: 26, gender: '女', birth: '1997-07-04', addr: '宜蘭' },
//   { id: uuidv4(), name: '阿良', age: 32, gender: '男', birth: '1991-08-28', addr: '新竹' },
// ];

// // Read
// app.get('/api/members', (req, res) => {
//   res.json({
//     code: 200,
//     message: '讀取會員成功',
//     result: memberList
//   })
// })

// // Create
// app.post('/api/members', (req, res) => {
//   const newMember = req.body
//   newMember.id = uuidv4()
//   memberList.push(newMember)

//   res.json({
//     code: 200,
//     message: '新增會員成功',
//     result: null
//   })
// })

// // Delete
// app.delete('/api/members/:id', (req, res) => {
//   const { id } = req.params
//   memberList = memberList.filter(user => user.id !== id)

//   res.json({
//     code: 200,
//     message: '刪除會員成功',
//     result: null
//   })
// })

// // Update
// app.put('/api/members/:id', (req, res) => {
//   const { id } = req.params
//   const updatedUser = req.body
//   const index = memberList.findIndex(user => user.id === id)

//   if (index !== -1) {
//     memberList[index] = updatedUser
//     res.json({
//       code: 200,
//       message: '修改成功',
//       result: null
//     })
//   } else {
//     res.status(404).json({
//       code: 404,
//       message: '找不到該用戶',
//       result: null
//     })
//   }
// })
// // #endregion

// // #region product.js
// let productList = [
//   { id: uuidv4(), name: 'Collings OM2H', price: 238000, quantity: 1, category: '木吉他', imageUrl: '/images/om2h.jpg' },
//   { id: uuidv4(), name: 'Lakewood M32C', price: 118000, quantity: 2, category: '木吉他', imageUrl: '/images/m32c.jpg' },
//   { id: uuidv4(), name: 'Maton EBG808TE', price: 84800, quantity: 4, category: '木吉他', imageUrl: '/images/808te.jpg' },
//   { id: uuidv4(), name: 'AER / Alpha Plus 50瓦', price: 42000, quantity: 3, category: '音箱', imageUrl: '/images/aer.jpg' },
//   { id: uuidv4(), name: 'PRS S2 Custom 24-08 Black Amber', price: 90300, quantity: 3, category: '電吉他', imageUrl: '/images/prs.jpg' },
//   { id: uuidv4(), name: 'Lowden F32', price: 164000, quantity: 2, category: '木吉他', imageUrl: '/images/lowdenf32.jpg' },
//   { id: uuidv4(), name: 'PRS John Mayer SE Silver Sky', price: 33500, quantity: 5, category: '電吉他', imageUrl: '/images/prs2.jpg' },
//   { id: uuidv4(), name: 'G7th Performance 3 銀色', price: 1590, quantity: 10, category: '配件', imageUrl: '/images/g7p3silver.jpg' },
//   { id: uuidv4(), name: 'G7th Performance 3 金色', price: 1800, quantity: 6, category: '配件', imageUrl: '/images/g7p3golden.jpg' },
//   { id: uuidv4(), name: 'G7th Heritage 銀色', price: 5800, quantity: 3, category: '配件', imageUrl: '/images/g7heritage.jpg' },
// ]

// app.get('/api/products', (req, res) => {
//   res.json({
//     code: 200,
//     msg: '獲得商品成功',
//     result: productList
//   })
// })

// const multer = require('multer')

// // 設定圖片儲存位置與檔名
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '/images')) // 圖片儲存資料夾
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname)
//     const filename = `${Date.now()}${ext}`
//     cb(null, filename)
//   }
// })
// const upload = multer({ storage })

// // 圖片上傳 API
// app.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: '沒有上傳檔案' })
//   }

//   const imageUrl = `/images/${req.file.filename}`
//   res.json({ imageUrl })
// })

// // Create
// app.post('/api/products', (req, res) => {
//   const newProduct = req.body
//   newProduct.id = uuidv4()
//   productList.push(newProduct)

//   res.json({
//     code: 200,
//     message: '新增商品成功',
//     result: null
//   })
// })

// // Update
// app.put('/api/products/:id', (req, res) => {
//   const { id } = req.params
//   const updatedProduct = req.body
//   const index = productList.findIndex(item => item.id === id)

//   if (index !== -1) {
//     productList[index] = updatedProduct
//     res.json({
//       code: 200,
//       message: '修改成功',
//       result: null
//     })
//   } else {
//     res.status(404).json({
//       code: 404,
//       message: '找不到該商品',
//       result: null
//     })
//   }
// })

// // delete
// app.delete('/api/products/:id', (req, res) => {
//   const { id } = req.params
//   productList = productList.filter(item => item.id !== id)
//   res.json({
//     code: 200,
//     message: '刪除成功',
//     result: null
//   })
// })
// // #endregion

// // #region order.js
// let orderList = [
//   { id: uuidv4(), orderNumber: 'ORD2411135839', createdAt: '2024-11-13', member: '小明', items: 'Lakewood M32', status: 'shipped' },
//   { id: uuidv4(), orderNumber: 'ORD2412254276', createdAt: '2024-12-25', member: '小美', items: 'G7th Performance 3 金色', status: 'shipped' },
//   { id: uuidv4(), orderNumber: 'ORD2502072521', createdAt: '2025-02-07', member: '小華', items: 'Maton EBG808TE', status: 'processing' },
//   { id: uuidv4(), orderNumber: 'ORD2503137490', createdAt: '2025-03-13', member: '阿明', items: 'Eastman PCH1', status: 'completed' },
//   { id: uuidv4(), orderNumber: 'ORD2503316843', createdAt: '2025-03-31', member: '大雄', items: 'G7th Performance 3 銀色', status: 'completed' },
//   { id: uuidv4(), orderNumber: 'ORD2504115877', createdAt: '2025-04-11', member: '小志', items: 'Eastman PCH1', status: 'processing' },
//   { id: uuidv4(), orderNumber: 'ORD2504151298', createdAt: '2025-04-15', member: '小美', items: 'Maton EBG808TE', status: 'processing' },
//   { id: uuidv4(), orderNumber: 'ORD2504186457', createdAt: '2025-04-18', member: '阿信', items: 'Lakewood M32', status: 'shipped' },
//   { id: uuidv4(), orderNumber: 'ORD2504198732', createdAt: '2025-04-19', member: '小明', items: 'G7th Performance 3 銀色', status: 'completed' },
//   { id: uuidv4(), orderNumber: 'ORD2504209031', createdAt: '2025-04-20', member: '阿亮', items: 'Eastman PCH1', status: 'processing' },
//   { id: uuidv4(), orderNumber: 'ORD2504214325', createdAt: '2025-04-21', member: '小志', items: 'Lakewood M32', status: 'shipped' },
//   { id: uuidv4(), orderNumber: 'ORD2504221239', createdAt: '2025-04-22', member: '小華', items: 'Maton EBG808TE', status: 'completed' },
//   { id: uuidv4(), orderNumber: 'ORD2504239652', createdAt: '2025-04-23', member: '大雄', items: 'G7th Performance 3 金色', status: 'shipped' },
//   { id: uuidv4(), orderNumber: 'ORD2504247763', createdAt: '2025-04-24', member: '阿明', items: 'Lakewood M32', status: 'processing' },
//   { id: uuidv4(), orderNumber: 'ORD2504255509', createdAt: '2025-04-25', member: '小美', items: 'Maton EBG808TE', status: 'completed' },
//   { id: uuidv4(), orderNumber: 'ORD2504266831', createdAt: '2025-04-26', member: '小志', items: 'G7th Performance 3 銀色', status: 'shipped' },
//   { id: uuidv4(), orderNumber: 'ORD2504272087', createdAt: '2025-04-27', member: '小明', items: 'Eastman PCH1', status: 'processing' },
//   { id: uuidv4(), orderNumber: 'ORD2504289312', createdAt: '2025-04-28', member: '阿信', items: 'Lakewood M32', status: 'completed' },
//   { id: uuidv4(), orderNumber: 'ORD2504293489', createdAt: '2025-04-29', member: '小華', items: 'G7th Performance 3 金色', status: 'processing' },
//   { id: uuidv4(), orderNumber: 'ORD2504307930', createdAt: '2025-04-30', member: '小美', items: 'Maton EBG808TE', status: 'shipped' },
// ]

// // Read
// app.get('/api/orders', (req, res) => {
//   res.json({
//     code: 200,
//     msg: '訂單獲取成功',
//     result: orderList
//   })
// })

// // Create
// app.post('/api/orders', (req, res) => {
//   const now = new Date()
//   const datePart = String(now.getFullYear()).slice(2) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0')
//   const random = Math.floor(1000 + Math.random() * 9000)
//   const newOrder = {
//     ...req.body,
//     id: uuidv4(),
//     orderNumber: `ORD${datePart}${random}`,
//   }

//   orderList.push(newOrder)

//   res.json({
//     code: 200,
//     message: '新增成功',
//     result: null
//   })
// })

// // Update
// app.put('/api/orders/:id', (req, res) => {
//   const { id } = req.params
//   const updatedOrder = req.body
//   const index = orderList.findIndex(item => item.id === id)

//   if (index !== -1) {
//     orderList[index] = updatedOrder
//     res.json({
//       code: 200,
//       message: '更改成功',
//       result: null
//     })
//   } else {
//     res.status(404).json({
//       code: 404,
//       message: '更改失敗',
//       result: null
//     })
//   }
// })

// // Delete
// app.delete('/api/orders/:id', (req, res) => {
//   const { id } = req.params
//   orderList = orderList.filter(item => item.id !== id)

//   res.json({
//     code: 200,
//     message: '訂單刪除成功',
//     result: null
//   })
// })
// // #endregion

// // #region user.js
// app.get('/api/users', authenticateToken, (req, res) => {
//   const users = loadUsers();


//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ code: 403, msg: '無權限' });
//   }
//   // 回傳所有使用者（帳號 + profile）
//   const userList = users.map(u => ({
//     id: u.id,
//     username: u.username,
//     ...u.profile
//   }));

//   return res.json({
//     code: 200,
//     msg: '獲取用戶成功',
//     result: userList
//   });
// });

// // delete
// app.delete('/api/users/:id', (req, res) => {
//   const token = req.headers.authorization;
//   const users = loadUsers();

//   const currentUser = users.find(u => 'mock-token-' + u.username === token);
//   if (!currentUser || currentUser.profile.role !== 'admin') {
//     return res.status(403).json({ code: 403, msg: '無權限' });
//   }

//   const { id } = req.params;
//   const newUsers = users.filter(user => user.id !== id);

//   fs.writeFileSync(USERS_FILE, JSON.stringify(newUsers, null, 2));

//   res.json({
//     code: 200,
//     message: '刪除用戶成功',
//     result: null
//   });
// });

// // update
// app.put('/api/users/:id', (req, res) => {
//   const users = loadUsers();
//   const { id } = req.params
//   const { role } = req.body

//   const index = users.findIndex(item => item.id === id)

//   users[index].profile.role = role;

//   fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

//   res.json({
//     code: 200,
//     message: '更新用戶身份成功',
//     result: null
//   })
// })
// // #endregion

// // #region cost.js
// let costList = [
//   { id: uuidv4(), name: '店面租金', category: '租金/水電', price: 120000 },
//   { id: uuidv4(), name: '店面電費', category: '租金/水電', price: 3243 },
//   { id: uuidv4(), name: '店面水費', category: '租金/水電', price: 1086 },
//   { id: uuidv4(), name: '職員薪水', category: '人事成本', price: 74000 },
//   { id: uuidv4(), name: 'Taylor進貨', category: '進貨成本', price: 164320 },
//   { id: uuidv4(), name: '職員勞健保', category: '人事成本', price: 22540 },
//   { id: uuidv4(), name: 'Eastman進貨', category: '進貨成本', price: 212000 },
//   { id: uuidv4(), name: '弦進貨', category: '進貨成本', price: 27500 },
//   { id: uuidv4(), name: '維修冷氣', category: '其他成本', price: 8000 },
// ]

// app.get('/api/costs', (req, res) => {
//   res.json({
//     code: 200,
//     message: '獲取成本成功',
//     result: costList
//   })
// })

// app.post('/api/costs', (req, res) => {
//   const newCost = req.body
//   newCost.id = uuidv4()
//   costList.push(newCost)

//   res.json({
//     code: 200,
//     message: '新增成本成功',
//     result: null
//   })
// })

// app.delete('/api/costs/:id', (req, res) => {
//   const { id } = req.params

//   costList = costList.filter(item => item.id !== id)
//   res.json({
//     code: 200,
//     message: '刪除成本成功',
//     result: null
//   })
// })
// // #endregion

// // #region revenue.js
// let revenueList = [
//   { id: uuidv4(), date: '2025-5-5', price: 76880 },
//   { id: uuidv4(), date: '2025-5-10', price: 162330 },
//   { id: uuidv4(), date: '2025-5-15', price: 82405 },
//   { id: uuidv4(), date: '2025-5-20', price: 64400 },
//   { id: uuidv4(), date: '2025-5-25', price: 132420 },
//   { id: uuidv4(), date: '2025-5-30', price: 246650 },
// ]

// app.get('/api/revenues', (req, res) => {
//   res.json({
//     code: 200,
//     message: '獲取營業額成功',
//     result: revenueList
//   })
// })

// app.post('/api/revenues', (req, res) => {
//   const newRevenue = req.body
//   newRevenue.id = uuidv4()
//   revenueList.push(newRevenue)

//   res.json({
//     code: 200,
//     message: '新增營業額成功',
//     result: null
//   })
// })

// app.delete('/api/revenues/:id', (req, res) => {
//   const { id } = req.params
//   revenueList = revenueList.filter(item => item.id !== id)

//   res.json({
//     code: 200,
//     message: '刪除營業額成功',
//     result: null
//   })
// })
// // #endregion

// #endregion