<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const userStore = useUserStore()
const router = useRouter()

const isRegister = ref(false)
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
    { min: 5, max: 20, message: '帳號必須為 5 - 20 個字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 5, max: 20, message: '密碼必須為 5 - 20 個字', trigger: 'blur' },
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

const loading = ref(false)
const loginFormRef = ref(null)
const loginForm = ref({
  username: '',
  password: ''
})
const loginRules = {
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    loading.value = true
    await api.register(registerForm.value)

    isRegister.value = false
    ElMessage.success('註冊成功')
  } catch (error) {
    if (typeof error === 'object') return
    ElMessage.error(error)
  } finally {
    loading.value = false
  }
}
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true

    const token = await api.login(loginForm.value)
    localStorage.setItem('token', token)
    
    const profile = await api.getProfile()
    userStore.setUser(profile)
    
    ElMessage.success('登入成功！')
    router.push('/home')
  } catch (error) {
    if (typeof error === 'object') return
    ElMessage.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="background flex justify-center items-center">
    <div class="auth-wrapper">
      <header class="flex gap-4 justify-center items-center mb-6">
        <el-icon size="30"><ShoppingBag /></el-icon>
        <h2>樂器行後台系統</h2>
      </header>

      <!-- 註冊表單 -->
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        v-if="isRegister"
      >
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" prefix-icon="Postcard" placeholder="請輸入用戶名稱" />
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
          <el-button type="primary" @click="handleRegister" :loading="loading">註冊</el-button>
        </el-form-item>
        <el-form-item>
          <el-link @click="handleChange"><ArrowLeft class="w-4 mr-1"/>登入</el-link>
        </el-form-item>
      </el-form>
      
      <!-- 登入表單 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        v-else
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="User" placeholder="請輸入帳號" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="Lock" type="password" placeholder="請輸入密碼" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">登入</el-button>
        </el-form-item>
        <el-form-item>
          <el-link @click="handleChange"><ArrowRight class="w-4 mr-1"/>註冊帳號</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.background {
  background: linear-gradient(135deg, #4b6180 0%, #7c92ad 100%);
  height: 100vh;
}

.auth-wrapper {
  background-color: #f0f4f8; 
  border-radius: 16px;
  box-shadow: 0px 5px 15px rgb(90, 90, 90);
  width: 100%;
  max-width: 450px;
  padding: 30px 40px 0px 40px;

  .el-input {
    height: 36px;
    font-size: 16px;
  }
  .el-button {
    width: 100%;
    height: 36px;
  }
  .el-link {
    color: #6c7a89;
    &:hover {
      color: #3a4756;
    }
  }
}
</style>