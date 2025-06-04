<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
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
  background-color: #b0c4d4;
  color: #333;
  border-bottom: 1px solid #c9d9e8;
}

.el-aside {
  background-color: #b0c4d4;
  color: #333;
}

.el-main {
  background-color: #f5f5f5;
  color: #333;
  height: 100%;
}
</style>