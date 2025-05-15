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
})
const registerRules = {
  name: [
    { required: true, message: '請輸入用戶名稱', trigger: 'blur' },
    { min: 3, max: 10, message: '用戶名稱必須為 3 - 10 個字', trigger: 'blur' },
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
    console.error('註冊失敗:', error.response?.data || error);
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

    ElMessage.success('登入成功')
    router.push('/home')
  } catch (error) {
    console.error('登入失敗:', error.response?.data || error);
    ElMessage.error('登入失敗')
  }
}
</script>

<template>
  <div class="background flex justify-center items-center">

    <div class="auth-wrapper">

      <div class="flex gap-4 justify-center mb-4">
        <el-icon size="30"><Headset /></el-icon>
        <h2>樂器行後台系統</h2>
      </div>

      <div>
        <!-- 註冊表單 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          v-if="isRegister"
        >
          <h3 class="title">註冊</h3>
          <el-form-item prop="name">
            <el-input v-model="registerForm.name" prefix-icon="User" placeholder="請輸入用戶名稱" />
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" prefix-icon="User" placeholder="請輸入帳號" />
          </el-form-item>
          <el-form-item prop="password">
              <el-input v-model="registerForm.password" prefix-icon="Lock" type="password" placeholder="請輸入密碼" />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" prefix-icon="Lock" type="password" placeholder="確認密碼" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRegister">註冊</el-button>
          </el-form-item>
          <el-form-item>
            <el-link @click="handleChange">返回登入</el-link>
          </el-form-item>
        </el-form>
        
        <!-- 登入表單 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          v-else
        >
          <h3 class="title">登入</h3>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="User" placeholder="請輸入帳號" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="Lock" type="password" placeholder="請輸入密碼" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin">登入</el-button>
          </el-form-item>
          <el-form-item>
            <el-link @click="handleChange">返回註冊</el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.background {
  height: 100vh;
  background: linear-gradient(to right, #B2DFDB, #A7F3D0);
}

.auth-wrapper {
  padding: 40px 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 0.5px solid black;
  box-shadow: 0 0 30px black;
  width: 100%;
  max-width: 400px;

  .title {
    display: inline-block;
    background-color: #A7F3D0;
    border: 1px solid black;
    border-radius: 15px;
    box-shadow: 1px 1px 5px gray;
    padding: 6px 10px;
    margin-bottom: 16px;
  }
  
  .el-input {
    height: 36px;
    font-size: 16px;
  }

  .el-button {
    width: 100%;
  }
}
</style>
