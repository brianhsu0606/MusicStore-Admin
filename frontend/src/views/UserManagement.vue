<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '@/api';

const userList = ref([])
const fetchUser = async () => {
  try {
    userList.value = await api.getUser()
  } catch {
    ElMessage.error('獲取用戶失敗')
  }
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <el-card>
    <el-table :data="userList">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性別">
        <template #default="{ row }">
          {{ row.gender === 'male' ? '男': row.gender === 'female' ? '女' : '尚未填寫' }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="信箱" />
      <el-table-column prop="birth" label="生日" />
      <el-table-column label="身份">
        <template #default="{ row }">
          <el-select v-model="row.role">
            <el-option label="職員" value="user"/>
            <el-option label="管理員" value="admin"/>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>