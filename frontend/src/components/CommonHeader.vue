<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const router = useRouter()
const handleLogout = () => {
  localStorage.removeItem('token')
  userStore.clearUser()
  
  router.push('/login')
  ElMessage.success('登出成功！')
}

const goToAccount = () => {
  router.push('/account')
}
</script>

<template>
  <header class="flex justify-between items-center h-full">
    <h3>後台管理系統</h3>
    <div class="header-content flex items-center">
      <p>歡迎回來：{{ userStore.name }} !</p>
      <p @click="goToAccount" class="account">帳戶資訊</p>
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="`/images/avatars/${userStore.avatar}`" class="user-img">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToAccount">帳戶資訊</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="less">
h3 {
  font-size: 20px;
  font-weight: 500;
  margin-left: 25px;
}

.header-content {
  p {
    padding: 0 20px;
    font-size: 18px;
    font-weight: 500;
    border-right: 1px solid black;
  }
  .account {
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background-color: #E0F2F1;
      color: #00796B;
    }
  }
  .user-img {
    width: 45px;
    height: 45px;
    margin-left: 20px;
    border-radius: 50%;
    border: 0.5px solid black;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.05);
      box-shadow: 1px 1px 5px gray;
    }
  }
}

// 覆蓋 Element Plus 的基礎樣式
:deep(.bread span) {
  color: black !important;
  cursor: pointer !important;
}
</style>