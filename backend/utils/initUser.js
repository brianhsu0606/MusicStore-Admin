const bcrypt = require('bcryptjs')
const SALT_ROUNDS = 10

const defaultUser = require('../data/defaultUser')
const User = require('../models/userModel')

async function createDefaultUser() {
  try {
    for (const user of defaultUser) {
      const existing = await User.findOne({ username: user.username })
      if (existing) {
        console.log(`已存在：${user.username}`)
        continue
      }

      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS)

      await User.create({
        employeeId: 1,
        username: user.username,
        password: hashedPassword,
        profile: {
          name: user.name || '-',
          role: user.role || 'user',
          gender: '-',
          birth: '-',
          email: '-',
          avatar: 'avatar1.jpg',
          lastLogin: '',
        }
      })

      console.log(`已建立帳號：${user.username}`)
    }
  } catch (err) {
    console.error('建立預設帳號失敗：', err)
  }
}

module.exports = createDefaultUser