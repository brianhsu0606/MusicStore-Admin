<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import api from '@/api'

const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    createdAt: '',
    member: '',
    items: '',
    price: '',
    status: '',
  }
})
const rules = {
  createdAt: [{ required: true, message: '請選擇下單日期', trigger: 'blur' }],
  member: [{ required: true, message: '請輸入會員名稱', trigger: 'blur' }],
  items: [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  price: [{ required: true, message: '請輸入訂單金額', trigger: 'blur' }],
}

// #region CRUD
const loading = ref(true)
const orderList = ref([])
const fetchOrders = async () => {
  loading.value = true
  try {
    orderList.value = await api.getOrders()
  } catch {
    ElMessage.error('獲取訂單失敗')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增訂單'
  Object.assign(dialog.form, {
    createdAt: dayjs().format('YYYY-MM-DD'),
    member: '',
    items: '',
    price: 0,
    status: 'processing',
  })
  formRef.value?.clearValidate()
}

const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯訂單'
  Object.assign(dialog.form, row)
  formRef.value?.clearValidate()
}

const changeStatus = async (row) => {
  try {
    await api.updateOrder(row, row.id)
    ElMessage.success('更改訂單狀態成功')
  } catch {
    ElMessage.error('更改訂單狀態失敗')
  }
}

const submit = async () => {
  try {
    await formRef.value.validate()
    if (dialog.isEdit) {
      await api.updateOrder(dialog.form.id, dialog.form)
    } else {
      await api.addOrder(dialog.form)
    }
    dialog.visible = false
    ElMessage.success(dialog.isEdit ? '編輯訂單成功' : '新增訂單成功')
    await fetchOrders()
  } catch {
    ElMessage.error(dialog.isEdit ? '編輯訂單失敗' : '新增訂單失敗')
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
  } catch (error) {
    return
  }
  try {
    await api.deleteOrder(id)
    await fetchOrders()
    ElMessage.success('刪除訂單成功')
  } catch (error) {
    ElMessage.error('刪除訂單失敗')
  }
}
// #endregion

const getTagType = (status) => {
  switch (status) {
    case 'processing': return 'primary'
    case 'shipped': return 'warning'
    case 'completed': return 'success'
    default: return ''
  }
}
const getStatusLabel = (status) => {
  switch (status) {
    case 'processing': return '處理中'
    case 'shipped': return '已出貨'
    case 'completed': return '已完成'
    default: return '未知'
  }
}

// 搜尋功能
const searchInput = ref('')
const filteredOrderList = computed(() => {
  return orderList.value.filter(item => item.orderNumber.toLowerCase().includes(searchInput.value.toLowerCase()))
})

// 分頁功能 Pagination
const currentPage = ref(1)
const pageSize = ref(8)
const handlePageChange = (page) => { currentPage.value = page }

const pagedOrderList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrderList.value.slice(start, end)
})

watch(searchInput, () => {
  currentPage.value = 1
})

const formatPrice = (row) => {
  return 'NT$ ' + row.price.toLocaleString()
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="flex justify-between mb-4">
    <el-button @click="handleAdd" type="primary">新增訂單</el-button>
    <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入訂單編號"></el-input>
  </header>

  <!-- 訂單列表 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <el-table :data="pagedOrderList" class="mb-4" stripe>
      <el-table-column prop="orderNumber" label="訂單編號" width="155" />
      <el-table-column prop="createdAt" label="下單日期" width="140" />
      <el-table-column prop="member" label="會員名稱" width="110" />
      <el-table-column prop="items" label="商品名稱" width="210" />
      <el-table-column prop="price" label="訂單金額" width="120" :formatter="formatPrice" />
      <el-table-column label="狀態">
        <template #default="{ row }">
          <el-select v-model="row.status" @change="changeStatus(row)" class="status-select">
            <template #prefix>
              <el-tag :type="getTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
            </template>
            <el-option label="處理中" value="processing" />
            <el-option label="已出貨" value="shipped" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)" type="primary">編輯</el-button>
          <el-button @click="handleDelete(row.id)" type="danger">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁功能 Pagination -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="filteredOrderList.length"
      @current-change="handlePageChange"
    />
  </el-card>


  <!-- 新增訂單 dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="500">
    <el-form :model="dialog.form" :rules="rules" ref="formRef">
      <el-form-item prop="createdAt" label="下單日期">
        <el-date-picker
          v-model="dialog.form.createdAt"
          value-format="YYYY-MM-DD"
          placeholder="選擇日期"
        />
      </el-form-item>
      <el-form-item prop="member" label="會員名稱">
        <el-input v-model="dialog.form.member" />
      </el-form-item>
      <el-form-item prop="items" label="商品名稱" > 
        <el-input v-model="dialog.form.items" />
      </el-form-item>
      <el-form-item prop="price" label="訂單金額"> 
        <el-input-number v-model="dialog.form.price" />
      </el-form-item>
      <el-form-item label="訂單狀態">
        <el-select v-model="dialog.form.status">
          <el-option label="處理中" value="processing"/>
          <el-option label="已出貨" value="shipped" />
          <el-option label="已完成" value="completed"/>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button @click="submit" type="primary">確認</el-button>
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

.el-card {
  .el-tag {
    font-size: 14px;
  }
}

::v-deep(.status-select .el-select__selected-item) {
  visibility: hidden; /* 隱藏文字 */
}
::v-deep(.status-select .el-select__prefix) {
  visibility: visible; /* 顯示 tag */
}
</style>