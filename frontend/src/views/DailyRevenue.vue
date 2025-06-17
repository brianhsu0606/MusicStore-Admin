<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useDialogWidth } from '@/composables/useDialogWidth'
import { usePagination } from '@/composables/usePagination'
import { useCrud } from '@/composables/useCrud'
import dayjs from 'dayjs'
import api from '@/api'

const userStore = useUserStore()
const { dialogWidth } = useDialogWidth()

const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    createdAt: '',
    price: 0,
    note: '',
    createdBy: ''
  }
})
const rules = {
  createdAt: [{ required: true, message: '請選擇日期', trigger: 'blur' },],
  price: [{ required: true, message: '請輸入營業額', trigger: 'blur' },],
  createdBy: [{ required: true, message: '請輸入登錄者', trigger: 'blur' }],
}

const {
  loading,
  list: revenueList,
  fetchData,
  handleAdd,
  handleEdit,
  handleDelete,
  submit,
} = useCrud({
  getApi: api.getRevenueList,
  addApi: api.addRevenue,
  updateApi: api.updateRevenue,
  deleteApi: api.deleteRevenue,
  formRef,
  dialog,
  defaultForm: {
    createdAt: dayjs().format('YYYY-MM-DD'),
    price: 0,
    note: '',
    createdBy: userStore.name,
  },
  getTitle: (type) => (type === 'add' ? '新增營業額' : '編輯營業額')
})

// 月份篩選 + 分頁功能
const currentMonth = ref(dayjs().format('YYYY-MM'))
const selectedMonth = ref(currentMonth.value)

const filteredRevenueList = computed(() => {
  return revenueList.value.filter((item) => dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value)
})
const { currentPage, pageSize, pagedList, handlePageChange } = usePagination(filteredRevenueList, 8)

// formatter
const formatDate = (_, __, value) => {
  return dayjs(value).format('YYYY-MM-DD')
}
const formatePrice = (row) => {
  return 'NT$ ' + row.price.toLocaleString()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- header 新增按鈕、選擇月份 -->
  <header class="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <el-button @click="handleAdd" type="primary" class="order-2 sm:order-1">新增營業額</el-button>
    <h3 class="order-1 sm:order-2 text-center">{{ selectedMonth }} 營業額</h3>
    <el-date-picker
      v-model="selectedMonth"
      type="month"
      size="large"
      format="YYYY-MM"
      value-format="YYYY-MM"
      :clearable="false"
      class="order-3"
    />
  </header>

  <!-- 營業額表格 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <div class="overflow-auto">
      <el-table :data="pagedList" class="mb-4 min-w-[800px]" stripe>
        <el-table-column prop="createdAt" label="日期" :formatter="formatDate"/>
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
    </div>

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
  <el-dialog v-model="dialog.visible" :title="dialog.title" class="responsive-dialog" :width="dialogWidth">
    <el-form :model="dialog.form" :rules="rules" ref="formRef" label-width="80px" label-position="right">
      <el-form-item prop="createdAt" label="選擇日期">
        <el-date-picker
          v-model="dialog.form.createdAt"
          value-format="YYYY-MM-DD"
          placeholder="請選擇日期"
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
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button @click="submit" type="primary">確認</el-button>
    </template>
  </el-dialog>
</template>