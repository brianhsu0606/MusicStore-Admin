const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const SALT_ROUNDS = 10;

const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const handleError = require('../utils/handleError')

// 註冊 register
router.post('/api/register', async (req, res) => {
  const { name, username, password } = req.body

  try {
    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '此帳號已存在',
        result: null
      })
    }

    const lastUser = await User.findOne().sort({ employeeId: -1 }).exec();
    const nextEmployeeId = lastUser ? lastUser.employeeId + 1 : 1;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await User.create({
      employeeId: nextEmployeeId,
      username,
      password: hashedPassword,
      profile: {
        role: 'user',
        name,
        gender: '',
        birth: '',
        email: '',
        avatar: 'avatar1.jpg'
      }
    })

    res.json({
      code: 200,
      message: '註冊成功',
      result: null
    })
  } catch (error) {
    handleError(res, error, '註冊失敗')
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

    // 登入時間
    user.profile.lastLogin = new Date().toISOString()
    await user.save()

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.profile.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      code: 200,
      message: '登入成功',
      result: token
    })
  } catch (error) {
    handleError(res, error, '登入失敗')
  }
})

module.exports = router;