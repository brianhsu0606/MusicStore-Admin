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
  background-color: #10B981;
}
.el-aside {
  background-color: #10B981;
}
.el-main {
  background-color: antiquewhite;
  height: 100%;
}
</style>
