<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'

const list = [
  { path: '/home', name: 'home', label: '首頁', icon: 'house' },
  { path: '/revenue', name: 'revenue', label: '每日營收', icon: 'Money' },
  { path: '/product', name: 'product', label: '商品庫存', icon: 'goods' },
  { path: '/order', name: 'order', label: '網路訂單', icon: 'Document' },
  { path: '/member', name: 'member', label: '會員管理', icon: 'user' },
  { path: '/finance', name: 'finance', label: '營收分析', icon: 'DataLine', isAdmin: true },
  { path: '/user', name: 'user', label: '權限管理', icon: 'user', isAdmin: true },
]

const router = useRouter()
const activePath = computed(() => router.currentRoute.value.path)

const uiStore = useUiStore()
const handleChange = (path) => {
  router.push(path)

  if (window.innerWidth < 768) {
    uiStore.isAsideVisible = false
  }
}
</script>

<template>
  <el-menu :default-active="activePath" router>
    <el-menu-item
      v-for="item in list"
      :index="item.path"
      :key="item.path"
      @click="handleChange(item.path)"
    > 
      <component class="icon" :is="item.icon"></component>
      <span>{{ item.label }}</span>
      <component
        v-if="item.isAdmin"
        :is="'Key'"
        class="admin-icon"
      />
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="less"> 
.el-menu-item {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background-color: #4b6180;
  border-bottom: 1px solid #475569;

  .icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
  .admin-icon {
    width: 20px;
    height: 20px;
    margin-left: 6px;
    color: #a1b9dc;
  }
  
  &:hover {
    background-color: #455366;
  }
  &.is-active {
    background-color: #26344c;
  }
}
</style>