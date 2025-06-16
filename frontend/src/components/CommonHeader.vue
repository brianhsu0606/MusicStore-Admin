<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'

const avatarImages = import.meta.glob('../assets/images/avatars/*.jpg', {
  eager: true,
  import: 'default'
})
const getAvatarPath = (filename) => avatarImages[`../assets/images/avatars/${filename}`]

const userStore = useUserStore()
const uiStore = useUiStore()
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
    <el-button
      class="sm:hidden"
      @click="uiStore.isAsideVisible = !uiStore.isAsideVisible"
      icon="Expand"
    />
    <h3 class="text-xl">樂器行後台系統</h3>

    <div class="flex items-center gap-8">
      <p class="text-lg font-medium hidden sm:inline">歡迎回來，{{ userStore.name }} !</p>
      <span class="hidden sm:inline">|</span>
      <p class="text-lg font-medium hidden sm:inline">身份：{{ roleLabel[userStore.role] }}</p>
      <span class="hidden sm:inline">|</span>

      <el-dropdown>
        <img :src="getAvatarPath(userStore.avatar)" class="user-img" title="帳戶選單">
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