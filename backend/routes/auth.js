const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mysecretkey123'; // 之後可以放在 .env 裡

const USERS_FILE = path.join(__dirname, '../data/users.json');
const loadUsers = () => {
  if (fs.existsSync(USERS_FILE)) {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }
  return [];
};


router.post('/api/register', async (req, res) => {
  const { name, username, password, role } = req.body;
  const users = loadUsers();

  if (users.some(user => user.username === username)) {
    return res.status(400).json({
      code: 400,
      message: '帳號已存在',
      result: null,
    });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  users.push({
    id: uuidv4(),
    username,
    password: hashedPassword,
    profile: {
      role,
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
    message: '註冊成功',
    result: null,
  });
});

// 登入 login
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(400).json({
      code: 400,
      message: '帳號或密碼錯誤',
      result: null,
    });
  }

  // 用 bcrypt 比對密碼
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      code: 400,
      message: '帳號或密碼錯誤',
      result: null,
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.profile.role
    },
    JWT_SECRET,
    { expiresIn: '2h' } // token 有效時間為 2 小時
  );

  return res.json({
    code: 200,
    message: '登入成功',
    result: {
      token,
    }
  });
});

module.exports = router;
