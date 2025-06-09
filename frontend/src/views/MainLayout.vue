<script setup>
import CommonHeader from '@/components/CommonHeader.vue'
import CommonAside from '@/components/CommonAside.vue'
</script>

<template>
  <el-container class="h-full">
    <el-header>
      <CommonHeader />
    </el-header>

    <el-container>
      <el-aside width="200px">
        <CommonAside />
      </el-aside>

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
</style>