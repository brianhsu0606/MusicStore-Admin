<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
</script>

<template>
  <el-container class="layout-container">
    <!-- 左側 -->
    <el-aside width="200px">
      <CommonAside />
    </el-aside>
    <!-- 右側 -->
    <el-container>
      <!-- 標頭 header -->
      <el-header>
        <CommonHeader />
      </el-header>
      <!-- 主內容 main -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.layout-container {
  height: 100%;
  background-color: antiquewhite;
}
.el-header {
  background-color: #10B981;
}
.el-aside {
  background-color: #10B981;
}
</style>
