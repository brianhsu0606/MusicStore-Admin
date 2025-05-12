<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

// #region CRUD
// 讀取訂單（ Read）
const orderList = ref([])
const fetchOrders = async () => {
  try {
    orderList.value = await api.getOrders()
  } catch {
    ElMessage.error('獲取訂單失敗')
  }
}

onMounted(() => {
  fetchOrders()
})

const dialog = reactive({
  visible: false,
  form: {
    id: null,
    orderNumber: null,
    createdAt: '',
    member: '',
    items: '',
    status: '',
  }
})

// 新增訂單（ Create ）
const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增訂單'
  dialog.form = {
    id: null,
    orderNumber: null,
    member: '',
    items: '',
    status: 'processing',
  }
}

// 編輯訂單（ Update ）
const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯訂單'
  dialog.form = { ...row }
}

const changeStatus = async (row) => {
  try {
    await api.updateOrder(row, row.id)
    ElMessage.success('更改訂單狀態成功')
  } catch {
    ElMessage.error('更改訂單狀態失敗')
  }
}

// 提交 dialog
const submit = async () => {
  try {
    if (dialog.isEdit) {
      await api.updateOrder(dialog.form, dialog.form._id)
      ElMessage.success('編輯成功')
    } else {
      await api.addOrder(dialog.form)
      ElMessage.success('新增成功')
    }
    dialog.visible = false
    await fetchOrders()
  } catch {
    ElMessage.error(dialog.isEdit ? '編輯失敗' : '新增失敗')
  }
}

// 刪除訂單（ Delete ）
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
    await api.deleteOrder(id)
    await fetchOrders()
    ElMessage.success('刪除訂單成功')
  } catch {
    ElMessage.error('刪除訂單失敗')
  }
}
// #endregion CRUD

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
const pagedOrderList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrderList.value.slice(start, end)
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
    <el-button @click="handleAdd" type="primary">新增訂單</el-button>
    <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入訂單編號"></el-input>
  </header>
  <!-- 訂單列表 table -->
  <el-card class="mb-4">
    <el-table :data="pagedOrderList" style="width: 100%">
      <el-table-column prop="orderNumber" label="訂單編號" />
      <el-table-column prop="createdAt" label="下單日期" width="150" />
      <el-table-column prop="member" label="會員名稱" width="140" />
      <el-table-column prop="items" label="商品名稱" width="200" />
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
          <el-button @click="handleDelete(row._id)" type="danger">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分頁功能 Pagination -->
  <el-pagination
    background
    layout="prev, pager, next"
    :current-page="currentPage"
    :page-size="pageSize"
    :total="filteredOrderList.length"
    @current-change="handlePageChange"
  />
  <!-- 新增訂單 dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title">
    <el-form :model="dialog.form">
      <el-form-item label="訂單編號">
        <el-input v-model="dialog.form.orderNumber"></el-input>
      </el-form-item>
      <el-form-item label="下單日期">
        <el-date-picker
          v-model="dialog.form.createdAt"
          type="date"
          placeholder="選擇日期"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="會員名稱">
        <el-input v-model="dialog.form.member"></el-input>
      </el-form-item>
      <el-form-item label="商品名稱" width="500"> 
        <el-input v-model="dialog.form.items"></el-input>
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