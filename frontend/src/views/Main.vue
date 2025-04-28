<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 左側 -->
      <CommonAside />
      <!-- 右側 -->
      <el-container>
        <el-header>
          <CommonHeader />
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout, .lay-container {
  height: 100%;
  background-color: antiquewhite;
}
.el-header {
  background-color: rgb(159.5, 206.5, 255);
}
</style>
