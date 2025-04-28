// --- src/views/OrderManagement.vue ---
<template>
  <el-card>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="id" label="訂單編號" />
      <el-table-column prop="user" label="用戶名稱" />
      <el-table-column prop="items" label="商品項目" />
      <el-table-column prop="status" label="狀態" />
      <el-table-column>
        <template #default="{ row }">
          <el-select v-model="row.status" placeholder="更改狀態">
            <el-option label="處理中" value="processing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const orders = ref([
  { id: 1, user: '小明', items: '吉他, 琴弦', status: 'processing' },
  { id: 2, user: '小美', items: '效果器', status: 'completed' },
])
</script>

<!-- // --- src/router/guard.js ---
import { useUserStore } from '@/stores/user'

export function setupRouteGuard(router) {
  router.beforeEach((to, from, next) => {
    const store = useUserStore()
    const isAdmin = store.user.role === 'admin'

    if (to.meta.requiresAdmin && !isAdmin) {
      next('/unauthorized')
    } else {
      next()
    }
  })
}
  --->