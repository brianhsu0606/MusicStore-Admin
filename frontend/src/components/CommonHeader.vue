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
  <header class="flex justify-between h-full">
    <!-- 頂部導航欄 左側 -->
    <div class="left-content flex items-center">
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 頂部導航欄 右側 -->
    <div class="right-content flex items-center">
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
.left-content {
  .el-button {
    width: 30px;
    height: 30px;
    margin-right: 10px;   
    .icons {
      width: 25px;
      height: 25px;
    }
  }
}
.right-content {
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