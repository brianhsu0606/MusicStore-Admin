<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import api from '@/api'

const currentMonth = ref(dayjs().format('YYYY-MM'))
const selectedMonth = ref(currentMonth.value)
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '新增成本',
  form: {
    name: '',
    category: '',
    date: dayjs().format('YYYY-MM-DD'),
    price: 0
  }
})

// #region 成本、營業額
const costCategories = [
  '租金/水電',
  '人事成本',
  '進貨成本',
  '其他成本'
]

const loadingCost = ref(true)
const costList = ref([])
const fetchCost = async () => {
  loadingCost.value = true
  try {
    costList.value = await api.getCost()
  } catch {
    ElMessage.error('獲取成本失敗')
  } finally {
    loadingCost.value = false
  }
}

const handleAdd = () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增成本'
  dialog.form = {
    name: '',
    category: '',
    date: dayjs().format('YYYY-MM-DD'),
    price: 0
  }
}

const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯成本'
  dialog.form = { ...row }
}

const submit = async () => {
  try {
    if (dialog.isEdit) {
      await api.updateCost(dialog.form.id, dialog.form)
    } else {
      await api.addCost(dialog.form)
    }
    dialog.visible = false
    ElMessage.success(dialog.isEdit ? '編輯成本成功' : '新增成本成功')
    await fetchCost()
  } catch (error) {
    ElMessage.error(dialog.isEdit ? '新增成本失敗' : '新增成本失敗')
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
  } catch (error) {
    return
  } 
  try {
    await api.deleteCost(id)
    await fetchCost()
    ElMessage.success('刪除成本成功')
  } catch {
    ElMessage.error('刪除成本失敗')
  }
}

const loadingRevenue = ref(true)
const revenueList = ref([])
const fetchRevenue = async () => {
  loadingRevenue.value = true
  try {
    revenueList.value = await api.getRevenue()
  } catch (error) {
    console.log(error);
    
    ElMessage.error('獲取營業額失敗')
  } finally {
    loadingRevenue.value = false
  }
}
// #endregion

// #region header資料 el-card
const currentMonthRevenue = computed(() => {
  return revenueList.value
    .filter(item => dayjs(item.date).format('YYYY-MM') === selectedMonth.value)
    .reduce((sum, item) => sum + item.price, 0)
})

const currentMonthCost = computed(() => {
  return costList.value
    .filter(item => dayjs(item.date).format('YYYY-MM') === selectedMonth.value)
    .reduce((sum, item) => sum + item.price, 0)
})

const currentMonthProfit = computed(() => {
  return currentMonthRevenue.value - currentMonthCost.value
})
// #endregion

// #region 分頁功能 pagination
const pageSize = ref(8)
const currentCostPage = ref(1)
const currentRevenuePage = ref(1)
const handleCostPageChange = (page) => { currentCostPage.value = page }
const handleRevenuePageChange = (page) => { currentRevenuePage.value = page }

const filteredCost = computed(() => 
  costList.value.filter((item) => dayjs(item.date).format('YYYY-MM') === selectedMonth.value)
)
const paginatedCost = computed(() => {
  const start = (currentCostPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCost.value.slice(start, end)
})

const filteredRevenue = computed(() => 
  revenueList.value.filter((item) => dayjs(item.date).format('YYYY-MM') === selectedMonth.value)
)
const revenueTableData = computed(() => 
  filteredRevenue.value.sort((a, b) => new Date(b.date) - new Date(a.date))
)
const paginatedRevenue = computed(() => {
  const start = (currentRevenuePage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return revenueTableData.value.slice(start, end)
})
// #endregion

// #region 圖表 v-chart
// 成本圓餅圖資料
const costChartData = computed(() => {
  const categoryMap = {}

  filteredCost.value.forEach(item => {
    const key = item.category || '未分類'
    categoryMap[key] = (categoryMap[key] || 0) + item.price
  })
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
})

const costChartOption = computed(() => ({
  title: { text: `${selectedMonth.value} 成本佔比圖` },
  tooltip: {},
  legend: { top: 'bottom' },
  series: [{
    name: '成本項目',
    type: 'pie',
    radius: '50%',
    data: costChartData.value
  }]
}))

// 營業額折線圖
const revenueChartData = computed(() => 
  filteredRevenue.value.sort((a, b) => new Date(a.date) - new Date(b.date))
)
const revenueChartOption = computed(() => ({
  title: { text: `${selectedMonth.value} 營業額趨勢圖` },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: revenueChartData.value.map(item => item.date),
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
  { icon: 'Money', bg: 'bg-green-400', title: `${selectedMonth.value} 營業額：`, value: () => 'NT ' + currentMonthRevenue.value.toLocaleString() },
  { icon: 'GoodsFilled', bg: 'bg-blue-400', title: `${selectedMonth.value} 成本：`, value: () => 'NT ' + currentMonthCost.value.toLocaleString() },
  { icon: 'SuccessFilled', bg: 'bg-red-500', title: `${selectedMonth.value} 淨利潤：`, value: () => 'NT ' + currentMonthProfit.value.toLocaleString() },
])

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
  <header class="flex justify-between items-center mb-4">
    <div class="flex gap-4">
      <el-card v-for="(item, index) in cardData" :key="index">
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
    />
  </header>

  <el-row :gutter="20">
    <!-- 左側 -->
    <el-col :lg="24" :xl="12" v-loading="loadingCost" element-loading-text="載入中，請稍候...">
      <!-- 成本圓餅圖 -->
      <el-card class="mb-4">
        <v-chart :option="costChartOption" autoresize style="height: 400px" />
      </el-card>

      <!-- 成本表格 table -->
      <el-card class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="mb-2">{{ selectedMonth }} 成本資料</h3>
          <el-button @click="handleAdd" type="primary">新增成本</el-button>
        </div>
        <el-table :data="paginatedCost" stripe class="mb-4">
          <el-table-column prop="date" label="日期" />
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

        <!-- 分頁功能 pagination -->
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="currentCostPage"
          :total="filteredCost.length"
          @current-change="handleCostPageChange"
        />
      </el-card>

      <!-- 新增成本 dialog -->
      <el-dialog v-model="dialog.visible" :title="dialog.title">
        <el-form>
          <el-form-item label="成本名稱">
            <el-input v-model="dialog.form.name" placeholder="請輸入成本名稱" />
          </el-form-item>
          <el-form-item label="成本分類">
            <el-select v-model="dialog.form.category" placeholder="請選擇成本分類">
              <el-option 
                v-for="(item, index) in costCategories"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="dialog.form.date"
              type="date"
              placeholder="選擇日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="金額">
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
    <el-col :lg="24" :xl="12" v-loading="loadingRevenue" element-loading-text="載入中，請稍候...">
      <!-- 營業額折線圖 -->
      <el-card class="mb-4">
        <v-chart :option="revenueChartOption" autoresize style="height: 400px" />
      </el-card>
      
      <!-- 營業額表格 table -->
      <el-card class="mb-4">
        <h3 class="mb-2">{{ selectedMonth }} 營業額資料</h3>
        <el-table :data="paginatedRevenue" stripe class="mb-4">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="revenue" label="營業額" :formatter="formatPrice" sortable />
        </el-table>

        <!-- 分頁功能 pagination -->
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="currentRevenuePage"
          :total="filteredRevenue.length"
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
</style>