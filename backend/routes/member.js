const express = require('express')
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const { authenticateToken } = require('../middleware/auth')

let memberList = [
  { id: uuidv4(), name: '小明', age: 25, gender: '男', birth: '1998-01-01', addr: '台北' },
  { id: uuidv4(), name: '小美', age: 28, gender: '女', birth: '1995-04-12', addr: '新竹' },
  { id: uuidv4(), name: '阿強', age: 32, gender: '男', birth: '1992-08-25', addr: '台中' },
  { id: uuidv4(), name: '小花', age: 22, gender: '女', birth: '2001-07-15', addr: '高雄' },
  { id: uuidv4(), name: '阿文', age: 30, gender: '男', birth: '1993-12-05', addr: '台南' },
  { id: uuidv4(), name: '小志', age: 29, gender: '男', birth: '1994-03-11', addr: '新北' },
  { id: uuidv4(), name: '美玲', age: 26, gender: '女', birth: '1997-06-20', addr: '台中' },
  { id: uuidv4(), name: '大雄', age: 31, gender: '男', birth: '1992-09-30', addr: '桃園' },
  { id: uuidv4(), name: '靜香', age: 27, gender: '女', birth: '1996-11-10', addr: '新竹' },
  { id: uuidv4(), name: '小偉', age: 24, gender: '男', birth: '1999-01-18', addr: '台北' },
  { id: uuidv4(), name: '阿珍', age: 33, gender: '女', birth: '1990-10-22', addr: '高雄' },
  { id: uuidv4(), name: '志明', age: 35, gender: '男', birth: '1989-04-05', addr: '台南' },
  { id: uuidv4(), name: '小拉', age: 21, gender: '女', birth: '2003-02-14', addr: '台中' },
  { id: uuidv4(), name: '大明', age: 29, gender: '男', birth: '1994-07-07', addr: '基隆' },
  { id: uuidv4(), name: '麗華', age: 30, gender: '女', birth: '1993-03-09', addr: '南投' },
  { id: uuidv4(), name: '阿德', age: 34, gender: '男', birth: '1990-08-03', addr: '嘉義' },
  { id: uuidv4(), name: '婉君', age: 23, gender: '女', birth: '2000-06-30', addr: '花蓮' },
  { id: uuidv4(), name: '志強', age: 27, gender: '男', birth: '1996-12-12', addr: '台北' },
  { id: uuidv4(), name: '小英', age: 26, gender: '女', birth: '1997-09-19', addr: '宜蘭' },
  { id: uuidv4(), name: '阿凱', age: 31, gender: '男', birth: '1992-05-23', addr: '新竹' },
  { id: uuidv4(), name: '小宏', age: 28, gender: '男', birth: '1995-02-10', addr: '台中' },
  { id: uuidv4(), name: '小芳', age: 24, gender: '女', birth: '1999-08-08', addr: '台南' },
  { id: uuidv4(), name: '志玲', age: 32, gender: '女', birth: '1992-01-15', addr: '台北' },
  { id: uuidv4(), name: '阿銘', age: 30, gender: '男', birth: '1993-06-03', addr: '新北' },
  { id: uuidv4(), name: '佳佳', age: 26, gender: '女', birth: '1997-03-28', addr: '花蓮' },
  { id: uuidv4(), name: '文傑', age: 33, gender: '男', birth: '1990-09-17', addr: '基隆' },
  { id: uuidv4(), name: '小翠', age: 22, gender: '女', birth: '2001-11-05', addr: '高雄' },
  { id: uuidv4(), name: '大志', age: 35, gender: '男', birth: '1989-12-22', addr: '台中' },
  { id: uuidv4(), name: '欣怡', age: 29, gender: '女', birth: '1994-05-10', addr: '新竹' },
  { id: uuidv4(), name: '志豪', age: 27, gender: '男', birth: '1996-07-19', addr: '台南' },
  { id: uuidv4(), name: '佩君', age: 25, gender: '女', birth: '1998-10-01', addr: '桃園' },
  { id: uuidv4(), name: '阿宏', age: 34, gender: '男', birth: '1989-06-16', addr: '台東' },
  { id: uuidv4(), name: '小倩', age: 28, gender: '女', birth: '1995-01-12', addr: '嘉義' },
  { id: uuidv4(), name: '建志', age: 31, gender: '男', birth: '1992-03-03', addr: '台北' },
  { id: uuidv4(), name: '美華', age: 30, gender: '女', birth: '1993-09-30', addr: '高雄' },
  { id: uuidv4(), name: '阿仁', age: 33, gender: '男', birth: '1990-11-11', addr: '屏東' },
  { id: uuidv4(), name: '小晴', age: 21, gender: '女', birth: '2002-04-17', addr: '新北' },
  { id: uuidv4(), name: '信志', age: 29, gender: '男', birth: '1994-02-25', addr: '苗栗' },
  { id: uuidv4(), name: '慧君', age: 26, gender: '女', birth: '1997-07-04', addr: '宜蘭' },
  { id: uuidv4(), name: '阿良', age: 32, gender: '男', birth: '1991-08-28', addr: '新竹' },
];

// Read
router.get('/api/members', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    message: '讀取會員成功',
    result: memberList
  })
})

// Create
router.post('/api/members', authenticateToken, (req, res) => {
  const newMember = req.body
  newMember.id = uuidv4()
  memberList.push(newMember)

  res.json({
    code: 200,
    message: '新增會員成功',
    result: null
  })
})

// Update
router.put('/api/members/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const updatedUser = req.body
  const index = memberList.findIndex(user => user.id === id)

  if (index !== -1) {
    memberList[index] = updatedUser
    res.json({
      code: 200,
      message: '修改成功',
      result: null
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '找不到該用戶',
      result: null
    })
  }
})

// Delete
router.delete('/api/members/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  memberList = memberList.filter(user => user.id !== id)

  res.json({
    code: 200,
    message: '刪除會員成功',
    result: null
  })
})

module.exports = router;