<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const userStore = useUserStore()
const router = useRouter()

const isRegister = ref(true)
const handleChange = () => {
  isRegister.value = !isRegister.value
}

const registerFormRef = ref(null)
const registerForm = ref({
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: '',
})
const registerRules = {
  name: [
    { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
    { min: 2, max: 10, message: '用戶名稱必須為 2 - 10 個字', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 5, max: 10, message: '帳號必須為 5 - 10 個字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 5, max: 10, message: '密碼必須為 5 - 10 個字', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '請再次輸入密碼', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('兩次輸入的密碼不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  role: [
    { required: true, message: '請選擇角色', trigger: 'blur' },
  ]
}

const loginFormRef = ref(null)
const loginForm = ref({
  username: '',
  password: ''
})
const loginRules = {
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 5, max: 10, message: '帳號必須為 5 - 10 個字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 5, max: 10, message: '密碼必須為 5 - 10 個字', trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    await api.register(registerForm.value)
    ElMessage.success('註冊成功')
    isRegister.value = false
  } catch (error) {
    ElMessage.error('註冊失敗')
  }
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    const res = await api.login(loginForm.value)
    localStorage.setItem('token', res.token)

    const profile = await api.getProfile()
    userStore.setUser(profile)
    userStore.loginTime = new Date().toLocaleString()

    ElMessage.success('登入成功')
    router.push('/home')
  } catch (error) {
    ElMessage.error('登入失敗')
  }
}
</script>

<template>
  <el-row class="container">
    <el-col :span="12" class="left-background"></el-col>
    <el-col :span="12" class="right-background">
      <!-- 註冊頁面 -->
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-container"
        v-if="isRegister"
      >
        <h3>註冊</h3>
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" prefix-icon="View" placeholder="請輸入用戶名稱"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" prefix-icon="User" placeholder="請輸入帳號"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="registerForm.password" prefix-icon="Lock" type="password" placeholder="請輸入密碼"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" prefix-icon="Lock" type="password" placeholder="確認密碼"></el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-select v-model="registerForm.role" placeholder="請選擇身份">
            <el-option label="職員" value="user" />
            <el-option label="管理員" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">註冊</el-button>
        </el-form-item>
        <el-form-item>
          <el-link @click="handleChange">返回登入</el-link>
        </el-form-item>
      </el-form>
      <!-- 登入頁面 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="register-container"
        v-else
      >
        <h3>登入</h3>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="User" placeholder="請輸入帳號"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="Lock" type="password" placeholder="請輸入密碼"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登入</el-button>
        </el-form-item>
        <el-form-item>
          <el-link @click="handleChange">返回註冊</el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.container {
  height: 100vh;
}

.left-background {
  background: url('/images/生日兔.jpeg') center;
  background-size: cover;
}

.right-background {
  background-color: #A7F3D0;
  display: flex;
  justify-content: center;
  align-items: center;

  .register-container {
    width: 360px;
    height: 430px;
    padding: 30px 40px;
    background-color: #E0F2F1;
    border: 0.5px solid gray;
    border-radius: 30px;
    box-shadow: 3px 3px 3px gray;
    h3 {
      text-align: center;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .el-button {
      width: 100%;
    }
  }
}

</style>