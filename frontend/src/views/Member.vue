<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePagination } from '@/composables/usePagination'
import dayjs from 'dayjs'
import api from '@/api'

const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    createdAt: '',
    name: '',
    gender: '',
    birth: '',
    addr: '',
  }
})
const rules = {
  createdAt: [{ required: true, message: '請選擇註冊日期', trigger: 'blur' }],
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '請選擇性別', trigger: 'blur' }],
}

// #region CRUD
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

const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增會員'
  Object.assign(dialog.form, {
    createdAt: dayjs().format('YYYY-MM-DD'),
    name: '',
    gender: '',
    birth: '',
    addr: ''
  })
  formRef.value?.clearValidate()
}

const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯會員'
  Object.assign(dialog.form, row)
  formRef.value?.clearValidate()
}

const submit = async () => {
  try {
    await formRef.value.validate()
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

const handleDelete = async (id) => {
  const confirmed = await ElMessageBox.confirm('確定要刪除嗎？', '刪除確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => false)
  if (!confirmed) return

  try {
    await api.deleteMember(id)
    await fetchMembers()
    ElMessage.success('刪除會員成功')
  } catch {
    ElMessage.error('刪除會員失敗')
  }
}
// #endregion

const calcAge = (birth) => {
  const today = new Date()
  const birthDate = new Date(birth)

  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  
  if (!birth) {
    return '-'
  }

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const formatEmpty = (_, __, value) => {
  return value ? value : '-'
}

// 月份篩選 + 搜尋功能 + 分頁功能
const currentMonth = ref(dayjs().format('YYYY-MM'))
const selectedMonth = ref(currentMonth.value)
const searchInput = ref('')

const filteredMemberList = computed(() => {
  return memberList.value.filter(item => {
    const matchMonth = !selectedMonth.value || dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value
    const matchSearch = !searchInput.value || item.name.toLowerCase().includes(searchInput.value.toLowerCase())
    return matchMonth && matchSearch
  })
})
const { currentPage, pageSize, pagedList, handlePageChange} = usePagination(filteredMemberList, 8)

onMounted(() => {
  fetchMembers()
})
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="mb-4 flex justify-between items-center">
    <el-button type="primary" @click="handleAdd">新增會員</el-button>
    <div>
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        format="YYYY-MM"
        value-format="YYYY-MM"
        size="large"
        placeholder="請選擇月份"
      />
      <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入會員名稱" class="ml-4"/>
    </div>
  </header>

  <!-- 會員表格 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <el-table :data="pagedList" class="mb-4" stripe>
      <el-table-column prop="createdAt" label="註冊日期" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性別" width="130px" />
      <el-table-column label="年齡" width="130px">
        <template #default="{ row }">{{ calcAge(row.birth) }}</template>
      </el-table-column>
      <el-table-column prop="birth" label="生日" :formatter="formatEmpty" />
      <el-table-column prop="addr" label="地址" :formatter="formatEmpty" />
      <el-table-column label="操作" width="180">
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
      :total="filteredMemberList.length"
      @current-change="handlePageChange"
    />
  </el-card>

  <!-- 新增、編輯會員 Dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title">
    <el-form :model="dialog.form" :rules="rules" ref="formRef" label-width="80px" label-position="right">
      <el-form-item prop="createdAt" label="註冊日期">
        <el-date-picker 
          v-model="dialog.form.createdAt"
          value-format="YYYY-MM-DD"
          placeholder="請選擇日期"
        />
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item prop="gender" label="性別">
        <el-radio-group v-model="dialog.form.gender" placeholder="請選擇性別">
          <el-radio label="男" value="男" />
          <el-radio label="女" value="女" />
          <el-radio label="其他" value="其他" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="dialog.form.birth"
          value-format="YYYY-MM-DD"
          placeholder="請選擇日期"
        />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="dialog.form.addr" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submit" type="primary">確認</el-button>
      <el-button @click="dialog.visible = false">取消</el-button>
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