<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, watch, computed, onMounted } from 'vue'
import api from '@/api'

const tableLabel = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年齡' },
  { prop: 'gender', label: '性別' },
  { prop: 'birth', label: '出生日期' },
  { prop: 'addr', label: '地址' },
]
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '新增用戶',
  form: {
    id: null,
    name: '',
    age: '',
    gender: '',
    birth: '',
    addr: '',
  }
})

// #region CRUD

// 讀取會員（ Read ）
const memberData = ref([])
const fetchMemberData = async () => {
  try {
    const res = await api.getMemberData()
    memberData.value = res.memberList
    handleSearch()
  } catch {
    ElMessage.error('無法取得會員資料')
  }  
}

// 新增會員（ Create ）
const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增用戶'
  dialog.form = {
    id: null,
    name: '',
    age: '',
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
  dialog.form = { ...row } // 深拷貝避免直接改資料
}

// 送出資料（ Create, Update ）
const submit = async () => {
  try {
    if (dialog.isEdit) {
      await api.updateMember(dialog.form.id, dialog.form)
      ElMessage.success('修改成功')
    } else {
      await api.addMember(dialog.form)
      ElMessage.success('新增成功')
    }
    dialog.visible = false
    fetchMemberData()
  } catch {
    ElMessage.error(dialog.isEdit ? '修改失敗' : '新增失敗')
  }
}

// 刪除會員（ Delete ）
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
    await api.deleteMember(id)
    ElMessage.success('刪除成功')
    fetchMemberData()
  } catch {
    ElMessage.error('刪除失敗')
  }
}
// #endregion CRUD

// 查詢 member
const filteredData = ref([])
const searchInput = ref('')
const handleSearch = () => {
  currentPage.value = 1
  filteredData.value = memberData.value.filter(member => {
    return member.name.toLowerCase().includes(searchInput.value.toLowerCase()) // 忽略大小寫過濾
  })
}
watch(searchInput, handleSearch)

// 動態寬度
const getColumnWidth = () => {
  const width = window.innerWidth
  
  if (width < 1440) {
    return 150
  } else {
    return 220
  }
}

onMounted(() => {
  fetchMemberData()
})

// 分頁功能
const currentPage = ref(1)      // 目前頁碼
const pageSize = ref(8)         // 每頁筆數
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})
const handlePageChange = (page) => {
  currentPage.value = page
}
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header>
    <el-button type="primary" @click="handleAdd">新增用戶</el-button>
    <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入用戶名稱" />
  </header>
  <!-- 會員表格 table -->
  <div>
    <el-table :data="pagedData">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="getColumnWidth()"
      />
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
      :current-page="currentPage"
      :page-size="pageSize"
      :total="filteredData.length"
      @current-change="handlePageChange"
    />
    <!-- 新增、編輯會員 Dialog -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px">
      <el-form :model="dialog.form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="dialog.form.name" />
        </el-form-item>
        <el-form-item label="年齡">
          <el-input v-model="dialog.form.age" />
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
  </div>
</template>

<style scoped lang="less">
header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .el-button {
    height: 38px;
  }
  .el-input {
    width: 250px;
    height: 38px;
    font-size: 16px;
  }
}
.el-table {
  margin-bottom: 20px;
}
</style>