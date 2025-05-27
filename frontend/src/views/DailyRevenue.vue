<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'
import api from '@/api'

const userStore = useUserStore()
const dialog = reactive({
  visible: false,
  title: '新增營業額',
  isEdit: true,
  form: {
    date: '',
    revenue: 0,
    note: '',
    createdBy: ''
  }
})

// #region CRUD
const loading = ref(true)
const revenueList = ref([])
const fetchRevenue = async () => {
  loading.value = true
  try {
    revenueList.value = await api.getRevenue()
  } catch (error) {
    ElMessage.error('獲取營業額失敗')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增營業額'
  dialog.form = {
    date: dayjs().format('YYYY-MM-DD'),
    price: 0,
    note: '',
    createdBy: userStore.name
  }
}

const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯營業額'
  dialog.form = { ...row }
}

const submit = async () => {
  try {
    if (dialog.isEdit) {
      await api.updateRevenue(dialog.form.id, dialog.form)
    } else {
      await api.addRevenue(dialog.form)
    }
    dialog.visible = false
    ElMessage.success(dialog.isEdit ? '編輯營業額成功' : '新增營業額成功')
    await fetchRevenue()
  } catch (error) {
    ElMessage.error(dialog.isEdit ? '編輯營業額失敗' : '新增營業額失敗')
  }
}

// 刪除營業額 delete
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
  } catch (error) {
    return
  }
  try {
    await api.deleteRevenue(id)
    await fetchRevenue()
    ElMessage.success('刪除營業額成功')
  } catch (error) {
    ElMessage.error('刪除營業額失敗')
  }
}
// #endregion

// 分頁功能
const pageSize = ref(8)
const currentPage = ref(1)
const selectedMonth = ref('')

const filteredRevenue = computed(() => {
  if (!selectedMonth.value) {
    return revenueList.value
  }
  return revenueList.value.filter((item) => dayjs(item.date).format('YYYY-MM') === selectedMonth.value)
})
const paginatedRevenue = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRevenue.value.slice(start, end)
})
const handlePageChange = (page) => {
  currentPage.value = page
}

// 價格標準化
const formatePrice = (row) => {
  return 'NT ' + row.price.toLocaleString()
}

onMounted(() => {
  fetchRevenue()
})
</script>

<template>
  <header class="mb-4 flex items-center justify-between">
    <el-button @click="handleAdd" type="primary">新增營業額</el-button>
    <el-date-picker
      v-model="selectedMonth"
      type="month"
      placeholder="選擇月份"
      format="YYYY-MM"
      value-format="YYYY-MM"
      clearable
    />
  </header>

  <!-- 營業額表格 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <el-table :data="paginatedRevenue" class="mb-4" stripe>
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="price" label="營業額" :formatter="formatePrice"/>
      <el-table-column prop="note" label="備註" />
      <el-table-column prop="createdBy" label="登錄者" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)" type="primary">編輯</el-button>
          <el-button @click="handleDelete(row.id)" type="danger">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁功能 pagination -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="filteredRevenue.length"
      @current-change="handlePageChange"
    />
  </el-card>
  
  <!-- 新增營業額 dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title">
    <el-form :model="dialog.form">
      <el-form-item label="選擇日期">
        <el-date-picker
          v-model="dialog.form.date"
          type="date"
          placeholder="選擇日期"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="輸入當日營業額">
        <el-input-number v-model="dialog.form.price"/>
      </el-form-item>
      <el-form-item label="備註">
        <el-input v-model="dialog.form.note" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="登錄者">
        <el-input v-model="dialog.form.createdBy"/>
      </el-form-item>       
    </el-form>
    <el-button @click="dialog.visible = false">取消</el-button>
    <el-button @click="submit" type="primary">確認</el-button>
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