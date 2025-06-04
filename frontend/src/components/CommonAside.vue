<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const list = ref([
  {
    path: '/home',
    name: 'home',
    label: '首頁',
    icon: 'house',
    url: 'Home'
  },
  {
    path: '/revenue',
    name: 'revenue',
    label: '每日營收',
    icon: 'Money',
    url: 'Revenue'
  },
  {
    path: '/product',
    name: 'product',
    label: '商品庫存',
    icon: 'goods',
    url: 'Product'
  },
  {
    path: '/order',
    name: 'order',
    label: '網路訂單',
    icon: 'Document',
    url: 'Order'
  },
  {
    path: '/member',
    name: 'member',
    label: '會員管理',
    icon: 'user',
    url: 'Member'
  },
  {
    path: '/admin-stats',
    name: 'admin-stats',
    label: '管理員介面',
    icon: 'DataLine',
    adminIcon: 'Key',
    url: 'Admin'
  },
  {
    path: '/user',
    name: 'user',
    label: '用戶權限管理',
    icon: 'user',
    adminIcon: 'Key',
    url: 'User'
  },
])

const menuItems = computed(() => list.value)

const router = useRouter()
const activePath = computed(() => router.currentRoute.value.path)

const handleMenu = (item) => {
  if (item.path !== activePath.value) {
    router.push(item.path)
  }
}
</script>

<template>
  <el-menu :default-active="activePath" router>
    <el-menu-item
      v-for="item in menuItems"
      :index="item.path"
      :key="item.path"
      @click="handleMenu(item)"
      :class="{ 'admin-item': ['admin-stats', 'user'].includes(item.name) }"
    > 
      <component class="icon" :is="item.icon"></component>
      <span>{{ item.label }}</span>
      <component
        v-if="['admin-stats', 'user'].includes(item.name)"
        class="admin-icon"
        :is="item.adminIcon"
      />
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="less"> 
.el-menu-item {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #eaf3fb;
  border-bottom: 1px solid #c9d9e8;

  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .admin-icon {
    width: 18px;
    height: 18px;
    margin-left: 6px;
    color: #888;
  }
  
  &:hover {
    background-color: #d6e3ee;
  }
  &.is-active {
    background-color: #bdd2e0;
    font-weight: 500;
  }
}
</style>