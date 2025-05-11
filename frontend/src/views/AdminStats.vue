<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const memberCount = ref(0)
const getMemberCount = async () => {
  try {
    const memberList = await api.getMembers()
    memberCount.value = memberList.length
  } catch {
    ElMessage.error('獲取會員數量失敗')
  }
}

// #region 成本 cost
const costCategories = [
  '租金/水電',
  '人事成本',
  '進貨成本',
  '其他成本'
]

const costList = ref([])
const fetchCost = async () => {
  try {
    costList.value = await api.getCost()
  } catch {
    ElMessage.error('獲取成本失敗')
  }
}

const totalCost = computed(() => {
  return costList.value.reduce((sum, item) => sum + item.price, 0)
})

const newCost = ref({name: '', category: '', price: 0})
const handleAddCost = async () => {
  if (!newCost.value.name || newCost.value.price <= 0) {
    ElMessage.warning('請填寫完整的成本名稱與金額')
    return
  }
  try {
    await api.addCost(newCost.value)
    await fetchCost()
    newCost.value = { name: '', price: 0 }
    ElMessage.success('新增成功')
  } catch {
    ElMessage.error('新增成本失敗')
  }
}

const handleDeleteCost = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
    await api.deleteCost(id)
    await fetchCost()
    ElMessage.success('刪除成本成功')
  } catch {
    ElMessage.error('刪除成本失敗')
  }
}
// #endregion

// #region 營業額 Revenue
const revenueList = ref([])
const fetchRevenue = async () => {
  try {
    revenueList.value = await api.getRevenue()
  } catch {
    ElMessage.error('獲取營業額失敗')
  }
}

const newRevenue = ref({ date: '', price: 0})
const handleAddRevenue = async () => {
  try {
    await api.addRevenue(newRevenue.value)
    await fetchRevenue()
  } catch {
    ElMessage.error('新增營業額失敗')
  }
}


const totalRevenue = computed(() => {
  return revenueList.value.reduce((sum, item) => sum + item.price, 0)
})

const handleDeleteRevenue = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
    await api.deleteRevenue(id)
    await fetchRevenue()
  } catch {
    ElMessage.error('刪除營業額失敗')
  }
}
// #endregion

const formatPrice = (row) => {
  return 'NT ' + Number(row.price).toLocaleString()
}

onMounted(() => {
  fetchCost()
  fetchRevenue()
  getMemberCount()
})

// 成本圓餅圖資料
const costPieChartData = computed(() => {
  const categoryMap = {}
  costList.value.forEach(item => {
    const key = item.category || '未分類'
    categoryMap[key] = (categoryMap[key] || 0) + item.price
  })
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
})

// 營業額折線圖資料
const revenueLineChartData = computed(() => {
  return {
    xAxis: {
      type: 'category',
      data: revenueList.value.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: revenueList.value.map(item => item.price),
        type: 'line',
        smooth: true
      }
    ]
  }
})

const cardData = [
  { icon: 'Money', bg: 'bg-green-400', title: '本月營業額：', value: () => 'NT ' + totalRevenue.value.toLocaleString() },
  { icon: 'GoodsFilled', bg: 'bg-blue-400', title: '本月成本：', value: () => 'NT ' + totalCost.value.toLocaleString() },
  { icon: 'SuccessFilled', bg: 'bg-red-500', title: '本月營淨利潤：', value: () => 'NT ' + (totalRevenue.value - totalCost.value).toLocaleString() },
  { icon: 'User', bg: 'bg-gray-400', title: '會員人數：', value: () => memberCount.value + '人' },
]
</script>

<template>
  <!-- 基本資訊 el-card -->
  <div class="card-content flex justify-start gap-4 mb-4">
    <el-card v-for="(item, index) in cardData" :key="index" class="w-80">
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

  <!-- 成本圓餅圖、營業額折線圖 -->
  <el-row :gutter="20" class="mb-4">
    <el-col :span="12">
      <el-card>
        <h3>成本占比圖</h3>
        <v-chart
          :option="{
            tooltip: { trigger: 'item' },
            legend: { top: 'bottom' },
            series: [
              {
                name: '成本項目',
                type: 'pie',
                radius: '50%',
                data: costPieChartData
              }
            ]
          }"
          autoresize
          style="height: 400px"
        />
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card>
        <h3>營業額折線圖</h3>
        <v-chart :option="revenueLineChartData" autoresize style="height: 400px" />
      </el-card>
    </el-col>
  </el-row>

  <!-- 新增成本、營業額 表格 -->
  <el-row :gutter="20" class="mb-4">
    <el-col :span="12">
      <!-- 成本資料 -->
      <el-card>
        <h3 class="mb-4">成本資料</h3>
        <!-- 新增成本 form -->
        <el-form>
          <el-form-item label="成本名稱">
            <el-input v-model="newCost.name" placeholder="請輸入成本名稱" />
          </el-form-item>
          <el-form-item label="成本分類">
            <el-select v-model="newCost.category" placeholder="請選擇成本分類">
              <el-option 
                v-for="(item, index) in costCategories"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金額">
            <el-input-number v-model="newCost.price" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleAddCost" type="primary">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- 成本表格 table -->
        <el-table :data="costList">
          <el-table-column prop="name" label="項目" />
          <el-table-column prop="category" label="分類" />
          <el-table-column prop="price" label="金額" :formatter="formatPrice" sortable />
          <el-table-column label="操作">
              <template #default="{ row }">
                <el-button @click="handleDeleteCost(row.id)" type="danger">刪除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 營業額資料 -->
    <el-col :span="12">
      <el-card>
        <h3 class="mb-4">營業額資料</h3>
        <!-- 新增營業額 form -->
        <el-form>
          <el-form-item label="選擇日期">
            <el-date-picker v-model="newRevenue.date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
          </el-form-item>
          <el-form-item label="金額">
            <el-input-number v-model="newRevenue.price" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleAddRevenue" type="primary">新增</el-button>
          </el-form-item>
        </el-form>
        <!-- 營業額表格 table -->
        <el-table :data="revenueList">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="price" label="金額" :formatter="formatPrice" sortable />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button @click="handleDeleteRevenue(row.id)" type="danger">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>  
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.card-content {
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