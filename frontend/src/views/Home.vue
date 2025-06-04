<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import api from '@/api'

// 商品（最新進貨 + 庫存）
const productLoading = ref(true)
const productList = ref([])
const productStock = ref([])
const fetchProductStock = async () => {
  productLoading.value = true
  try {
    productList.value = await api.getProducts()

    const map = productList.value.reduce((acc, item) => {   
      acc[item.category] = (acc[item.category] || 0) + item.quantity
      return acc
    }, {})

    productStock.value = Object.entries(map).map(([category, quantity]) => ({
      category,
      quantity
    }))
  } catch (error) {
    ElMessage.error('獲取商品失敗')
  } finally {
    productLoading.value = false
  }
}

const recentStockIn = computed(() => {
  return [...productList.value]
    .filter(p => p.lastStockIn)
    .sort((a, b) => new Date(b.lastStockIn) - new Date(a.lastStockIn))
    .slice(0, 5)
})

// 訂單
const orderLoading = ref(true)
const orderList = ref([])
const orderCount = ref(0)
const fetchOrderCount = async () => {
  orderLoading.value = true
  try {
    orderList.value = await api.getOrders()
    orderCount.value = orderList.value.filter(item => item.status === 'processing').length
  } catch (error) {
    ElMessage.error('獲取訂單數量失敗')
  } finally {
    orderLoading.value = false
  }
}

const selectedDays = ref(30)
const filteredOrders = computed(() => {
  const today = dayjs()
  return orderList.value.filter(order =>
    dayjs(order.createdAt).isAfter(today.subtract(selectedDays.value, 'day'))
  )
})

const ordersPerDay = computed(() => {
  const result = {}
  for (let i = 0; i < selectedDays.value; i++) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    result[date] = 0
  }

  filteredOrders.value.forEach(order => {
    const date = dayjs(order.createdAt).format('YYYY-MM-DD')
    if (result[date] !== undefined) result[date]++
  })

  return {
    labels: Object.keys(result).reverse(),
    values: Object.values(result).reverse()
  }
})

// 長條圖 echart
const chartOption = computed(() => ({
  tooltip: {},
  xAxis: {
    type: 'category',
    data: ordersPerDay.value.labels,
    axisLabel: { rotate: 45 }
  },
  yAxis: { type: 'value' },
  series: [{
    name: '訂單數量',
    type: 'bar',
    data: ordersPerDay.value.values,
    itemStyle: { color: '#b0c4d4' }
  }]
}))

const memberCount = ref(0)
const fetchMemberCount = async () => {
  try {
    const memberList = await api.getMembers()
    memberCount.value = memberList.length
  } catch (error) {
    ElMessage.error('獲取用戶數量失敗')
  }
}

const cardData = [
  { icon: 'User', bg: 'bg-green-400', title: '會員人數：', value: () => memberCount.value + ' 人' },
  { icon: 'Document', bg: 'bg-blue-400', title: '未出貨訂單：', value: () => orderCount.value},
]

onMounted(() => {
  fetchMemberCount()
  fetchOrderCount()
  fetchProductStock()
})
</script>

<template>
  <el-row :gutter="20">
    <!-- 左邊 -->
    <el-col :span="10">
      <!-- 最新進貨 el-table -->
      <el-card v-loading="productLoading" element-loading-text="載入中，請稍候..." class="mb-4">
        <h3 class="mb-2">最近 5 筆進貨</h3>
        <el-table :data="recentStockIn" stripe>
          <el-table-column prop="lastStockIn" label="進貨日期" min-width="50"/>
          <el-table-column prop="name" label="商品名稱" />
          <el-table-column prop="quantity" label="數量" min-width="26"/>
        </el-table>
      </el-card>
      
      <!-- 庫存表格 el-table -->
      <el-card v-loading="productLoading" element-loading-text="載入中，請稍候...">
        <h3 class="mb-2">商品總庫存</h3>
        <el-table :data="productStock" stripe>
          <el-table-column prop="category" label="分類" />
          <el-table-column prop="quantity" label="庫存量">
            <template #default="{ row }">
              <span :class="{ 'text-red-500 font-semibold': row.quantity < 20 }">{{ row.quantity }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <!-- 右邊 -->
    <el-col :span="14">
      <!-- 資料卡 el-card -->
      <div class="flex gap-4 mb-4">
        <el-card v-for="(item, index) in cardData" :key="index" class="flex-1">
          <div class="flex items-center gap-4">
            <el-icon :size="50" :class="`${item.bg} rounded-lg p-1`">
              <component :is="item.icon" />
            </el-icon>
            <div class="card-info">
              <h3>{{ item.title }}</h3>
              <p class="text-xl text-gray-500 font-medium">{{ item.value() }}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 訂單分析長條圖 v-chart -->
      <el-card v-loading="orderLoading" element-loading-text="載入中，請稍候...">
        <header class="flex justify-between items-center">
          <h3 class="text-xl font-medium">最近 {{ selectedDays }} 天的訂單數量</h3>
          <el-select v-model="selectedDays" size="large" style="width: 150px">
            <el-option :label="'最近 7 天'" :value="7" />
            <el-option :label="'最近 14 天'" :value="14" />
            <el-option :label="'最近 30 天'" :value="30" />
          </el-select>
        </header>
        <v-chart :option="chartOption" autoresize style="height: 400px" />
      </el-card>
    </el-col>
  </el-row>
</template>