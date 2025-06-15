<script setup>
import CommonHeader from '@/components/CommonHeader.vue'
import CommonAside from '@/components/CommonAside.vue'
import { useUiStore } from '@/stores/ui'
import { onMounted, onUnmounted } from 'vue'

const uiStore = useUiStore()

const handleResize = () => {
  if (window.innerWidth >= 768) {
    uiStore.isAsideVisible = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <el-container class="h-full">
    <el-header>
      <CommonHeader />
    </el-header>

    <el-container>
      <transition name="slide-aside">
        <el-aside v-if="uiStore.isAsideVisible" width="200px">
          <CommonAside />
        </el-aside>
      </transition>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.el-header {
  background-color: #334155;
  color: white;
  border-bottom: 1px solid #475569;
}

.el-aside {
  background-color: #334155;
  color: white;
}

.el-main {
  background-color: #f5f5f5;
  color: #333;
  height: 100%;
}


/* 這裡設定滑動的動畫，從左邊滑入滑出 */
.slide-aside-enter-from,
.slide-aside-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-aside-enter-active,
.slide-aside-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-aside-enter-to,
.slide-aside-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* 手機版時 Aside 預設樣式 */
.mobile-aside {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 999;
  background-color: #334155;
}
</style>