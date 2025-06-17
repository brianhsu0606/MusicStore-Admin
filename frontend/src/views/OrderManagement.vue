<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useDialogWidth } from '@/composables/useDialogWidth'
import { usePagination } from '@/composables/usePagination'
import { useCrud } from '@/composables/useCrud'
import dayjs from 'dayjs'
import api from '@/api'

const { dialogWidth } = useDialogWidth()

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
  status: [{ required: true, message: '請選擇訂單狀態', trigger: 'blur' }],
}

const {
  loading,
  list: orderList,
  fetchData,
  handleAdd,
  handleEdit,
  handleDelete,
  submit
} = useCrud({
  getApi: api.getOrderList,
  addApi: api.addOrder,
  updateApi: api.updateOrder,
  deleteApi: api.deleteOrder,
  formRef,
  dialog,
  defaultForm: {
    createdAt: dayjs().format('YYYY-MM-DD'),
    member: '',
    items: '',
    price: 0,
    status: '',
  },
  getTitle: (type) => (type === 'add' ? '新增訂單' : '編輯訂單')
})

const changeStatus = async (id, status) => {
  try {
    await api.updateOrder(id, { status })
    ElMessage.success('更改訂單狀態成功')
  } catch {
    ElMessage.error('更改訂單狀態失敗')
  }
}

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

// 月份篩選 + 搜尋功能 + 分頁功能
const currentMonth = ref(dayjs().format('YYYY-MM'))
const selectedMonth = ref(currentMonth.value)
const searchInput = ref('')

const filteredOrderList = computed(() => {
  return orderList.value.filter(item => {
    const matchMonth = !selectedMonth.value || dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value
    const matchSearch = !searchInput.value || item.orderNumber.toLowerCase().includes(searchInput.value.toLowerCase())
    return matchMonth && matchSearch
  })
})
const { currentPage, pageSize, pagedList, handlePageChange } = usePagination(filteredOrderList, 8)

// formatter
const formatDate = (_, __, value) => {
  return dayjs(value).format('YYYY-MM-DD')
}
const formatPrice = (row) => {
  return 'NT$ ' + row.price.toLocaleString()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <el-button @click="handleAdd" type="primary" class="order-2 sm:order-1">新增訂單</el-button>
    <h3 class="order-1 sm:order2 text-center">{{ selectedMonth ? selectedMonth+' ': '全部' }}訂單</h3>
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 order-3">
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        size="large"
        format="YYYY-MM"
        value-format="YYYY-MM"
        placeholder="選擇月份"
      />
      <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入訂單編號" />
    </div>
  </header>

  <!-- 訂單列表 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <div class="overflow-auto">
      <el-table :data="pagedList" class="mb-4 min-w-[1000px]" stripe>
        <el-table-column prop="orderNumber" label="訂單編號" min-width="120" />
        <el-table-column prop="createdAt" label="下單日期" min-width="100" :formatter="formatDate" />
        <el-table-column prop="member" label="會員名稱" min-width="80" />
        <el-table-column prop="items" label="商品名稱" min-width="180"/>
        <el-table-column prop="price" label="訂單金額" min-width="100" :formatter="formatPrice" />
        <el-table-column prop="status" label="狀態" min-width="140">
          <template #default="{ row }">
            <el-select v-model="row.status" @change="changeStatus(row.id, row.status)" class="status-select">
              <template #prefix>
                <el-tag :type="getTagType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
              </template>
              <el-option label="處理中" value="processing" />
              <el-option label="已出貨" value="shipped" />
              <el-option label="已完成" value="completed" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <template #default="{ row }">
            <el-button @click="handleEdit(row)" type="primary">編輯</el-button>
            <el-button @click="handleDelete(row.id)" type="danger">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
  <el-dialog v-model="dialog.visible" :title="dialog.title" :width="dialogWidth">
    <el-form :model="dialog.form" :rules="rules" ref="formRef" label-width="80px" label-position="right">
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
      <el-form-item prop="status" label="訂單狀態">
        <el-select v-model="dialog.form.status" placeholder="請選擇訂單狀態">
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
.el-tag {
  font-size: 14px;
}

::v-deep(.status-select .el-select__selected-item) {
  visibility: hidden; /* 隱藏文字 */
}
::v-deep(.status-select .el-select__prefix) {
  visibility: visible; /* 顯示 tag */
}
</style>