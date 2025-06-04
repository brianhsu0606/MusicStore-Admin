<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

const roleMap = {
  superadmin: '超級管理員',
  admin: '管理員',
  user: '職員'
}
const roleLabel = computed(() => roleMap[userStore.role] || '未知角色')

const toProfile = () => {
  router.push('/account')
}
const handleLogout = () => {
  localStorage.removeItem('token')
  userStore.clearUser()
  router.push('/login')
  ElMessage.success('登出成功！')
}
</script>

<template>
  <header class="flex justify-between items-center h-full">
    <h3 class="text-xl ml-4">樂器行後台系統</h3>
    <div class="right-content flex items-center">
      <p>歡迎回來，{{ userStore.name }} !</p>
      <p>身份：{{ roleLabel }}</p>
      <el-dropdown>
        <img :src="`/images/avatars/${userStore.avatar}`" class="user-img" title="帳戶選單">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toProfile">帳戶資訊</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="less">
.right-content {
  p {
    padding: 0 24px;
    font-size: 18px;
    font-weight: 500;
    border-right: 1.5px solid #333; 
  }

  .user-img {
    width: 45px;
    height: 45px;
    margin-left: 24px;
    border-radius: 50%;
    border: 1px solid gray;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0px 1px 2px gray;
    }
  }
}
</style>