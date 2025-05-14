const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行中，請訪問 http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const Member = require('./models/memberModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const Cost = require('./models/costModel');
const Revenue = require('./models/revenueModel');

const defaultMembers = require('./data/defaultMembers');
const defaultProducts = require('./data/defaultProducts');
const defaultOrders = require('./data/defaultOrders');
const defaultCost = require('./data/defaultCost');
const defaultRevenue = require('./data/defaultRevenue');


mongoose.connect('mongodb+srv://myuser:vue3projectDATABASE@cluster0.e8k1tey.mongodb.net/myproject?retryWrites=true&w=majority&appName=Cluster0', {})
  .then(async () => {
    console.log('資料庫連線成功');

    try {
      // 測試用，重啟伺服器時清空資料
      await Member.deleteMany({});
      await Product.deleteMany({});
      await Order.deleteMany({});
      await Cost.deleteMany({});
      await Revenue.deleteMany({});
      console.log('舊有資料已清除');

      await Member.insertMany(defaultMembers);
      await Product.insertMany(defaultProducts);
      await Order.insertMany(defaultOrders);
      await Cost.insertMany(defaultCost);
      await Revenue.insertMany(defaultRevenue);
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
