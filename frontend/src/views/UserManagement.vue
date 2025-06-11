<script setup>
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useCrud } from '@/composables/useCrud';
import { useUserStore } from '@/stores/user';
import api from '@/api';
import dayjs from 'dayjs';

const userStore = useUserStore()

const {
  loading,
  list: userList,
  fetchData,
  handleDelete,
} = useCrud({
  getApi: api.getUserList,
  deleteApi: api.deleteUser,
})

const changeRole = async (id, role) => {
  try {
    await api.updateUser(id, { role })
    ElMessage.success('更新用戶身份成功')
  } catch {
    ElMessage.error('更新用戶身份失敗')
  }
}
// formatter
const formatDate = (_, __, value) => {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-'
}
const formatEmpty = (_, __, value) => {
  return value ? value : '-'
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <el-table :data="userList" stripe>
      <el-table-column prop="employeeId" label="員工編號" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性別">
        <template #default="{ row }">
          {{ row.gender === 'male' ? '男' : (row.gender === 'female' ? '女' : (row.gender === 'others' ? '其他' : '-')) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="信箱" :formatter="formatEmpty" />
      <el-table-column prop="birth" label="生日" :formatter="formatDate" />
      <el-table-column prop="lastLogin" label="最後登入日期" :formatter="formatDate" />
      <el-table-column label="身份" width="150">
        <template #default="{ row }">
          <template v-if="row.role === 'superadmin'">
            <el-select v-model="row.role" disabled>
              <el-option label="超級管理員" value="superadmin"/>
            </el-select>
          </template>
          <template v-else>
            <el-select v-model="row.role" @change="changeRole(row.id, row.role)" :disabled="row.id === userStore.id">
              <el-option label="職員" value="user"/>
              <el-option label="管理員" value="admin"/>
            </el-select>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            @click="handleDelete(row.id)"
            v-if="row.role !== 'superadmin'"
            :disabled="row.id === userStore.id"
            type="danger" 
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>