const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mysecretkey123'; // 之後可以放在 .env 裡

const User = require('../models/userModel')

// 註冊 register
router.post('/api/register', async (req, res) => {
  const { name, username, password, role } = req.body

  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '帳號已存在',
        result: null
      })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const newUser = new User({
      username,
      password: hashedPassword,
      profile: {
        name,
        role,
        gender: '',
        birth: '',
        email: '',
        avatar: 'avatar1.jpeg'
      }
    })

    await newUser.save()

    res.json({
      code: 200,
      message: '註冊成功',
      result: null
    })
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

// 登入 login
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({
        code: 400,
        message: '帳號或密碼錯誤',
        result: null
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        code: 400,
        message: '帳號或密碼錯誤',
        result: null
      })
    }

    user.profile.lastLogin = new Date().toISOString()
    await user.save()

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.profile.role
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      code: 200,
      message: '登入成功',
      result: {
        token
      }
    })
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '伺服器錯誤',
      result: null
    })
  }
})

module.exports = router;
