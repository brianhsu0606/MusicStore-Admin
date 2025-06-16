require('dotenv').config()

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { })

app.use(require('./routes/auth'));
app.use(require('./routes/profile'));
app.use(require('./routes/revenue'));
app.use(require('./routes/product'));
app.use(require('./routes/order'));
app.use(require('./routes/member'));
app.use(require('./routes/cost'));
app.use(require('./routes/user'));

const Revenue = require('./models/revenueModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const Member = require('./models/memberModel');
const Cost = require('./models/costModel');

const initUser = require('./utils/initUser');
const defaultRevenue = require('./data/defaultRevenue');
const defaultProducts = require('./data/defaultProducts');
const defaultOrders = require('./data/defaultOrders');
const defaultMembers = require('./data/defaultMembers');
const defaultCost = require('./data/defaultCost');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('資料庫連線成功');

    try {
      const hasData = await Revenue.findOne();

      if (!hasData) {
        await initUser();
        await Revenue.insertMany(defaultRevenue);
        await Product.insertMany(defaultProducts);
        await Order.insertMany(defaultOrders);
        await Member.insertMany(defaultMembers);
        await Cost.insertMany(defaultCost);
        console.log('首次啟動：預設資料已成功插入');
      } else {
        console.log('已存在資料，略過初始化');
      }
    } catch (err) {
      console.error('重置會員資料失敗:', err);
    }
  })
  .catch((err) => console.error('MongoDB 連線失敗', err));