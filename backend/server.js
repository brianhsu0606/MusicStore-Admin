const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')))

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行中，請訪問 http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const Member = require('./models/memberModel');
const defaultMembers = require('./data/defaultMembers');
const Order = require('./models/orderModel');
const defaultOrders = require('./data/defaultOrders');
const Product = require('./models/productModel');
const defaultProducts = require('./data/defaultProducts');


mongoose.connect('mongodb+srv://myuser:vue3projectDATABASE@cluster0.e8k1tey.mongodb.net/myproject?retryWrites=true&w=majority&appName=Cluster0', {})
  .then(async () => {
    console.log('資料庫連線成功');

    try {
      // 測試用，重啟伺服器時清空資料
      await Member.deleteMany({});
      await Order.deleteMany({});
      await Product.deleteMany({});
      console.log('舊有資料已清除');

      await Member.insertMany(defaultMembers);
      await Order.insertMany(defaultOrders);
      await Product.insertMany(defaultProducts);
      console.log('預設資料已成功插入');

    } catch (err) {
      console.error('重置會員資料失敗:', err);
    }
  })
  .catch((err) => console.error('MongoDB 連線失敗', err));



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
