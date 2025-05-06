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
    path: '/member',
    name: 'member',
    label: '會員管理',
    icon: 'user',
    url: 'Member'
  },
  {
    path: '/product',
    name: 'product',
    label: '商品管理',
    icon: 'goods',
    url: 'Product'
  },
  {
    path: '/order',
    name: 'order',
    label: '訂單管理',
    icon: 'video-play',
    url: 'Order'
  },
  {
    path: '/user',
    name: 'user',
    label: '用戶管理',
    icon: 'user',
    url: 'User'
  },
])
const noChildren = computed(() => list.value.filter(item => !item.children))

const router = useRouter()
const handleMenu = (item) => {
  router.push(item.path)
}
</script>

<template>
  <el-menu>
    <el-menu-item
      v-for="item in noChildren"
      :index="item.path"
      :key="item.path"
      @click="handleMenu(item)"
    > 
      <component class="icons" :is="item.icon"></component>
      <span>{{ item.label }}</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="less">
.el-menu {
  background-color: #E0F2F1;
  text-align: center;

  .el-menu-item {
    color: #333;
    border-bottom: 1px solid gray;
    font-size: 17px;
    font-weight: 500;
    &:hover {
      background-color: #A7F3D0;
    }
    .icons {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
  .el-menu-item.is-active {
    color: #065F46;
    background-color: #A7F3D0;
  }
}


</style>