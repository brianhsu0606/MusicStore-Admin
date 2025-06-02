<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import api from '@/api';

const userStore = useUserStore()

const loading = ref(true)
const userList = ref([])
const fetchUsers = async () => {
  loading.value = true
  try {
    userList.value = await api.getUsers()
  } catch {
    ElMessage.error('獲取用戶失敗')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除用戶嗎？')
  } catch (error) {
    return
  }
  try {
    await api.deleteUser(id)
    await fetchUsers()
    ElMessage.success('刪除用戶成功')
  } catch {
    ElMessage.error('刪除用戶失敗')
  }
}

const changeRole = async (id, role) => {
  try {
    await api.updateUser(id, { role })
    ElMessage.success('更新用戶身份成功')
  } catch {
    ElMessage.error('更新用戶身份失敗')
  }
}

const formatEmpty = (_, __, value) => {
  return value ? value : '-'
}
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
      <el-table-column prop="birth" label="生日" :formatter="formatEmpty" />
      <el-table-column label="最後登入日期">
        <template #default="{ row }">
          {{ row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : '-' }}
        </template>
      </el-table-column>
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