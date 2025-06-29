<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
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
    name: '',
    category: '',
    createdAt: '',
    price: 0
  }
})
const rules = {
  name: [{ required: true, message: '請輸入成本名稱', trigger: 'blur' }],
  category: [{ required: true, message: '請選擇成本分類', trigger: 'blur' }],
  createdAt: [{ required: true, message: '請選擇成本日期', trigger: 'blur' }],
  price: [{ required: true, message: '請輸入成本金額', trigger: 'blur' }],
}

const costCategories = [
  '租金/水電',
  '人事成本',
  '進貨成本',
  '其他成本'
]

const {
  loading: costLoading,
  dialogLoading,
  list: costList,
  fetchData: fetchCost,
  handleAdd,
  handleEdit,
  handleDelete,
  submit
} = useCrud({
  getApi: api.getCostList,
  addApi: api.addCost,
  updateApi: api.updateCost,
  deleteApi: api.deleteCost,
  formRef,
  dialog,
  defaultForm: {
    name: '',
    category: '',
    createdAt: dayjs().format('YYYY-MM-DD'),
    price: 0
  },
  getTitle: (type) => (type === 'add' ? '新增成本' : '編輯成本')
})

const {
  loading: revenueLoading,
  list: revenueList,
  fetchData: fetchRevenue
} = useCrud({
  getApi: api.getRevenueList
})

// #region header資料 el-card
const currentMonthRevenue = computed(() => {
  return revenueList.value
    .filter(item => dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value)
    .reduce((sum, item) => sum + item.price, 0)
})

const currentMonthCost = computed(() => {
  return costList.value
    .filter(item => dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value)
    .reduce((sum, item) => sum + item.price, 0)
})

const currentMonthProfit = computed(() => {
  return currentMonthRevenue.value - currentMonthCost.value
})
// #endregion

// 月份篩選 + 分頁功能
const currentMonth = ref(dayjs().format('YYYY-MM'))
const selectedMonth = ref(currentMonth.value)

const filteredCostList = computed(() => {
  return costList.value.filter((item) => dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value)
})
const filteredRevenueList = computed(() => {
  return revenueList.value.filter((item) => dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value)
})

const {
  currentPage: currentCostPage,
  pageSize: costPageSize,
  pagedList: paginatedCost,
  handlePageChange: handleCostPageChange
} = usePagination(filteredCostList, 8, false)

const {
  currentPage: currentRevenuePage,
  pageSize: revenuePageSize,
  pagedList: paginatedRevenue,
  handlePageChange: handleRevenuePageChange
} = usePagination(filteredRevenueList, 8, false)

// #region 圖表 v-chart
const costPieData = computed(() => {
  const categoryMap = filteredCostList.value.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.price
    return acc
  }, {})
  return Object.entries(categoryMap).map(([name, value]) => { return { name, value } })
})

const costPieOption = computed(() => ({
  title: { text: `${selectedMonth.value} 成本佔比圖` },
  tooltip: {},
  legend: { top: 'bottom' },
  series: [{
    name: '成本項目',
    type: 'pie',
    radius: '50%',
    data: costPieData.value
  }]
}))

// 營業額折線圖
const revenueChartData = computed(() => {
  return [...filteredRevenueList.value].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
})

const revenueChartOption = computed(() => ({
  title: { text: `${selectedMonth.value} 營業額趨勢圖` },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: revenueChartData.value.map(item => dayjs(item.createdAt).format('YYYY-MM-DD')),
    axisLabel: { rotate: 45 }
  },
  yAxis: { type: 'value' },
  series: [{    
    name: '營業額',
    type: 'line',
    data: revenueChartData.value.map(item => item.price),
  }]
}))
// #endregion

const cardData = computed(() => [
  { icon: 'GoodsFilled', bg: 'bg-blue-400', title: `${selectedMonth.value} 成本：`, value: () => 'NT ' + currentMonthCost.value.toLocaleString() },
  { icon: 'Money', bg: 'bg-green-400', title: `${selectedMonth.value} 營業額：`, value: () => 'NT ' + currentMonthRevenue.value.toLocaleString() },
  { icon: 'SuccessFilled', bg: 'bg-red-500', title: `${selectedMonth.value} 淨利潤：`, value: () => 'NT ' + currentMonthProfit.value.toLocaleString() },
])

// formatter
const formatDate = (_, __, value) => {
  return dayjs(value).format('YYYY-MM-DD')
}
const formatPrice = (row) => {
  return 'NT ' + Number(row.price).toLocaleString()
}

onMounted(() => {
  fetchCost()
  fetchRevenue()
})
</script>

<template>
  <!-- 基本資訊 el-card -->
  <header class="flex flex-col sm:flex-row justify-between gap-4 mb-4">
    <div class="flex flex-col sm:flex-row order-2 sm:order-1 gap-4">
      <el-card v-for="(item, index) in cardData" :key="index" class="min-w-[300px]">
        <div class="flex gap-4 items-center">
          <el-icon :size="50" :class="`${item.bg} rounded-lg p-1`">
            <component :is="item.icon" />
          </el-icon>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.value() }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <el-date-picker
      v-model="selectedMonth"
      type="month"
      size="large"
      format="YYYY-MM"
      value-format="YYYY-MM"
      placeholder="選擇月份"
      :clearable="false"
      style="width: 200px; height: 42px; font-size: 18px"
      class="order-1 sm:order-2"
    />
  </header>

  <el-row :gutter="20">
    <!-- 左側 -->
    <el-col :lg="24" :xl="12" v-loading="costLoading" element-loading-text="載入中，請稍候...">
      <!-- 成本圓餅圖 -->
      <el-card class="mb-4">
        <div class="overflow-auto">
          <v-chart :option="costPieOption" autoresize class="h-[400px] min-w-[300px]" />
        </div>
      </el-card>

      <!-- 成本表格 table -->
      <el-card class="mb-4">
        <div class="overflow-auto">
          <header class="flex justify-between items-center mb-2 min-w-[800px]">
            <h3 class="mb-2">{{ selectedMonth }} 成本資料</h3>
            <el-button @click="handleAdd" type="primary">新增成本</el-button>
          </header>
          <el-table :data="paginatedCost" stripe class="mb-4 min-w-[800px]">
            <el-table-column prop="createdAt" label="日期" :formatter="formatDate" />
            <el-table-column prop="name" label="項目" />
            <el-table-column prop="category" label="分類" />
            <el-table-column prop="price" label="金額" :formatter="formatPrice" sortable />
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
          :page-size="costPageSize"
          :current-page="currentCostPage"
          :total="filteredCostList.length"
          @current-change="handleCostPageChange"
        />
      </el-card>

      <!-- 新增成本 dialog -->
      <el-dialog v-model="dialog.visible" :title="dialog.title" :width="dialogWidth">
        <el-form
          :model="dialog.form"
          :rules="rules"
          ref="formRef"
          label-width="80px"
          label-position="right"
          v-loading="dialogLoading"
          element-loading-text="載入中，請稍候..."
        >
          <el-form-item prop="name" label="成本名稱">
            <el-input v-model="dialog.form.name" />
          </el-form-item>
          <el-form-item prop="category" label="成本分類">
            <el-select v-model="dialog.form.category" placeholder="請選擇成本分類">
              <el-option 
                v-for="(item, index) in costCategories"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="createdAt" label="日期">
            <el-date-picker
              v-model="dialog.form.createdAt"
              value-format="YYYY-MM-DD"
              placeholder="選擇日期"
            />
          </el-form-item>
          <el-form-item prop="price" label="金額">
            <el-input-number v-model="dialog.form.price" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button @click="submit" type="primary">確認</el-button>
        </template>
      </el-dialog>
    </el-col>

    <!-- 右側 -->
    <el-col :lg="24" :xl="12" v-loading="revenueLoading" element-loading-text="載入中，請稍候...">
      <!-- 營業額折線圖 -->
      <el-card class="mb-4">
        <div class="overflow-auto">
          <v-chart :option="revenueChartOption" autoresize class="h-[400px] min-w-[400px]"/>
        </div>
      </el-card>
      
      <!-- 營業額表格 table -->
      <el-card class="mb-4">
        <h3 class="mb-2">{{ selectedMonth }} 營業額資料</h3>
        <div class="overflow-auto">
          <el-table :data="paginatedRevenue" stripe class="mb-4 min-w-[900px]">
            <el-table-column prop="createdAt" label="日期" :formatter="formatDate" />
            <el-table-column prop="price" label="營業額" :formatter="formatPrice" sortable />
            <el-table-column prop="note" label="備註" />
            <el-table-column prop="createdBy" label="登錄者" />
          </el-table>
        </div>
        <!-- 分頁功能 pagination -->
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="revenuePageSize"
          :current-page="currentRevenuePage"
          :total="filteredRevenueList.length"
          @current-change="handleRevenuePageChange"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
header {
  h3 {
    font-size: 21px;
  }
  p {
    color: gray;
    font-size: 19px;
    font-weight: 500;
  }
}

// .el-button {
//   height: 38px;
// }

</style>