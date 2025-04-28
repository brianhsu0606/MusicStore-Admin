<script setup>
import { ref, computed } from 'vue'
import { useDateStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'

const store = useDateStore()
const width = computed(() => store.isCollapse ? '64px' : '200px')

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
    path: '/other',
    name: 'other',
    label: '其他',
    icon: 'location',
    children: [
      {
        path: '/page1',
        name: 'page1',
        label: '頁面1',
        icon: 'setting',
        url: 'page1'
      },
      {
        path: '/page2',
        name: 'page2',
        label: '頁面2',
        icon: 'setting',
        url: 'page2'
      },
    ]
  }
])
const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))

const router = useRouter()
const handleMenu = (item) => {
  router.push(item.path)
}
</script>

<template>
  <el-aside :width="width">
    <el-menu
      :collapse="store.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="!store.isCollapse">後台管理系統</h3>
      <h3 v-show="store.isCollapse">後台</h3>
      <!-- 右側導航 一級列表 -->
      <el-menu-item
        v-for="item in noChildren"
        :index="item.path"
        :key="item.path"
        @click="handleMenu(item)"
      > 
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <!-- 右側導航 二級列表 -->
      <el-sub-menu
        v-for="item in hasChildren"
        :index="item.path"
        :key="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <!-- 二級小列表 -->
        <el-menu-item-group>
          <el-menu-item
            v-for="subItem in item.children"
            :index="subItem.path"
            :key="subItem.path"
            @click="handleMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<style scoped lang="less">
.el-aside {
  height: 100%;
  background-color: rgb(121.3, 187.1, 255);
  transition: 0.2s;
  .el-menu {
    background-color: rgb(159.5, 206.5, 255);
    text-align: center;
    h3 {
      height: 70px;
      line-height: 70px;
      background-color: rgb(121.3, 187.1, 255);
      border-bottom: 1px solid gray;
    }
    .el-menu-item {
      border-bottom: 1px solid gray;
      font-size: 17px;
      font-weight: 500;
    }
    .el-sub-menu {
      border-bottom: 1px solid gray;
      font-size: 17px;
      font-weight: 500;
    }
  }
}
.icons {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>