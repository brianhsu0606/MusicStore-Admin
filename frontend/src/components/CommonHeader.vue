<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const roleLabel = {
  superadmin: '超級管理員',
  admin: '管理員',
  user: '職員'
}

const router = useRouter()
const toAccount = () => {
  router.push({ name: 'account' })
}
const handleLogout = () => {
  localStorage.removeItem('token')
  userStore.clearUser()
  router.push({ name: 'login' })
  ElMessage.success('登出成功！')
}
</script>

<template>
  <header class="flex justify-between items-center px-3 h-full">
    <h3 class="text-xl">樂器行後台系統</h3>
    <div class="flex items-center gap-8">
      <p class="text-lg font-medium">歡迎回來，{{ userStore.name }} !</p>
      <span>|</span>
      <p class="text-lg font-medium">身份：{{ roleLabel[userStore.role] }}</p>
      <span>|</span>

      <el-dropdown>
        <img :src="`/images/avatars/${userStore.avatar}`" class="user-img" title="帳戶選單">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toAccount">帳戶資訊</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="less">
.user-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
}
</style>