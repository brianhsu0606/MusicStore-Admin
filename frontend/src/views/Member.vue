<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import api from '@/api'

const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '新增用戶',
  form: {
    name: '',
    gender: '',
    birth: '',
    addr: '',
  }
})

// #region CRUD
// 讀取會員（ Read ）
const loading = ref(true)
const memberList = ref([])
const fetchMembers = async () => {
  loading.value = true
  try {
    memberList.value = await api.getMembers()
  } catch {
    ElMessage.error('無法取得會員資料')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMembers()
})

// 新增會員（ Create ）
const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增用戶'
  dialog.form = {
    name: '',
    gender: '',
    birth: '',
    addr: ''
  }
}

// 編輯會員（ Update ）
const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯用戶'
  dialog.form = { ...row }
}

// 送出資料（ Create, Update ）
const submit = async () => {
  try {
    if (dialog.isEdit) {
      await api.updateMember(dialog.form.id, dialog.form)
    } else {
      await api.addMember(dialog.form)
    }
    dialog.visible = false
    ElMessage.success(dialog.isEdit ? '編輯會員成功': '新增會員成功')
    await fetchMembers()
  } catch(error) {
    ElMessage.error(dialog.isEdit ? '編輯會員失敗' : '新增會員失敗')
  }
}

// 刪除會員（ Delete ）
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
  } catch (error) {
    return
  }
  try {
    await api.deleteMember(id)
    await fetchMembers()
    ElMessage.success('刪除會員成功')
  } catch {
    ElMessage.error('刪除會員失敗')
  }
}
// #endregion

// 動態寬度
const getColumnWidth = () => {
  const width = window.innerWidth
  
  if (width < 1440) {
    return 150
  } else {
    return 220
  }
}

const calcAge = (birth) => {
  const today = new Date()
  const birthDate = new Date(birth)

  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// 查詢功能
const searchInput = ref('')
const filteredMember = computed(() => {
  return memberList.value.filter(item => item.name.toLowerCase().includes(searchInput.value.toLowerCase()))
})

// 分頁功能 Pagination
const pageSize = ref(8)
const currentPage = ref(1)
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMember.value.slice(start, end)
})

watch(searchInput, () => {
  currentPage.value = 1
})

const handlePageChange = (page) => {
  currentPage.value = page
}
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="flex justify-between mb-4">
    <el-button type="primary" @click="handleAdd">新增用戶</el-button>
    <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入會員名稱" />
  </header>

  <!-- 會員表格 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <el-table :data="pagedData" class="mb-4" stripe>
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="年齡">
        <template #default="{ row }">{{ calcAge(row.birth) }}</template>
      </el-table-column>
      <el-table-column prop="gender" label="性別" />
      <el-table-column prop="birth" label="生日" />
      <el-table-column prop="addr" label="地址" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleEdit(row)">編輯</el-button>
          <el-button type="danger" @click="handleDelete(row.id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁功能 Pagination -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="filteredMember.length"
      @current-change="handlePageChange"
    />
  </el-card>

  <!-- 新增、編輯會員 Dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px">
    <el-form :model="dialog.form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item label="性別">
        <el-select v-model="dialog.form.gender" placeholder="請選擇">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="dialog.form.birth"
          type="date"
          placeholder="選擇日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="dialog.form.addr" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click="submit">確認</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
header {
  .el-button {
    height: 38px;
  }
  .el-input {
    width: 250px;
    height: 38px;
    font-size: 16px;
  }
}
</style>