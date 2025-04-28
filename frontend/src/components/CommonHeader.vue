<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useDateStore } from '@/stores/index'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const store = useDateStore()
const handleCollapse = () => {
  store.isCollapse = !store.isCollapse
}

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
  <div class="header">
    <!-- 頂部導航欄 左側 -->
    <div class="left-content">
      <el-button @click="handleCollapse" />
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首頁</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 頂部導航欄 右側 -->
    <div class="right-content">
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
  </div>
</template>

<style scoped lang="less">
.header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-content {
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
  p {
    padding: 0 20px;
    font-size: 18px;
    font-weight: 500;
    border-right: 1px solid black;
  }
  .account {
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      text-shadow: 1px 1px 3px gray;
      background-color: rgb(128, 188, 244);
    }
  }
  .user-img {
    width: 48px;
    height: 48px;
    margin-left: 20px;
    border-radius: 50%;
    border: 1px solid gray;
    transition: 0.1s;
    &:hover {
      transform: scale(1.03);
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