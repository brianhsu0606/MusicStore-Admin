<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePagination } from '@/composables/usePagination'
import { useUserStore } from '@/stores/user'
import dayjs from 'dayjs'
import api from '@/api'

const userStore = useUserStore()


const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    date: '',
    price: 0,
    note: '',
    createdBy: ''
  }
})
const rules = {
  date: [{ required: true, message: '請選擇日期', trigger: 'blur' },],
  price: [{ required: true, message: '請輸入營業額', trigger: 'blur' },],
  createdBy: [{ required: true, message: '請輸入登錄者', trigger: 'blur' }],
}

// #region CRUD
const loading = ref(true)
const revenueList = ref([])
const fetchRevenue = async () => {
  loading.value = true
  try {
    revenueList.value = await api.getRevenue()
  } catch (error) {
    ElMessage.error('無法取得營業額資料')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增營業額'
  Object.assign(dialog.form, {
    date: dayjs().format('YYYY-MM-DD'),
    price: 0,
    note: '',
    createdBy: userStore.name
  })
  formRef.value?.clearValidate()
}

const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯營業額'
  Object.assign(dialog.form, row)
  formRef.value?.clearValidate()
}

const submit = async () => {
  try {
    await formRef.value.validate()
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

// 價格標準化
const formatePrice = (row) => {
  return 'NT$ ' + row.price.toLocaleString()
}

// 月份篩選 + 分頁功能
const currentMonth = ref(dayjs().format('YYYY-MM'))
const selectedMonth = ref(currentMonth.value)

const filteredRevenueList = computed(() => {
  return revenueList.value.filter((item) => dayjs(item.date).format('YYYY-MM') === selectedMonth.value)
})
const { currentPage, pageSize, pagedList, handlePageChange } = usePagination(filteredRevenueList, 8)

onMounted(() => {
  fetchRevenue()
})
</script>

<template>
  <!-- header 新增按鈕、選擇月份 -->
  <header class="mb-4 flex justify-between items-center">
    <el-button @click="handleAdd" type="primary">新增營業額</el-button>
    <el-date-picker
      v-model="selectedMonth"
      type="month"
      size="large"
      format="YYYY-MM"
      value-format="YYYY-MM"
      placeholder="選擇月份"
      :clearable="false"
    />
  </header>

  <!-- 營業額表格 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <el-table :data="pagedList" class="mb-4" stripe>
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
      :total="filteredRevenueList.length"
      @current-change="handlePageChange"
    />
  </el-card>
  
  <!-- 新增營業額 dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title">
    <el-form :model="dialog.form" :rules="rules" ref="formRef" label-width="80px" label-position="right">
      <el-form-item prop="date" label="選擇日期">
        <el-date-picker
          v-model="dialog.form.date"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
        />
      </el-form-item>
      <el-form-item prop="price" label="營業額">
        <el-input-number v-model="dialog.form.price" />
      </el-form-item>
      <el-form-item label="備註">
        <el-input v-model="dialog.form.note" type="textarea" />
      </el-form-item>
      <el-form-item prop="createdBy" label="登錄者">
        <el-input v-model="dialog.form.createdBy" />
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
}
</style>