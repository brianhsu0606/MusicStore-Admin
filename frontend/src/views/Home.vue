<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import api from '@/api'

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

// 計算近30天的訂單數量
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
    itemStyle: { color: '#10B981' }
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

onMounted(() => {
  fetchMemberCount()
  fetchOrderCount()
  fetchProductStock()
})

const cardData = [
  { icon: 'User', bg: 'bg-green-400', title: '會員人數：', value: () => memberCount.value + ' 人' },
  { icon: 'Document', bg: 'bg-blue-400', title: '未出貨訂單：', value: () => orderCount.value },
]
</script>

<template>
  <el-row :gutter="20">
    <!-- 左邊 -->
    <el-col :span="10" class="left-content">
      <!-- 左邊上方 基本資料卡 el-card -->
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
      <!-- 左邊下方 庫存表格 el-table -->
      <el-card v-loading="productLoading" element-loading-text="載入中，請稍候...">
        <el-table :data="productStock" stripe>
          <el-table-column prop="category" label="分類" />
          <el-table-column prop="quantity" label="庫存量">
            <template #default="{ row }">
              <span :class="{ 'text-red-500 font-semibold': row.quantity < 20 }">
                {{ row.quantity }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 右邊 -->
    <el-col :span="14" class="right-content">
      <!-- 右邊 訂單分析長條圖 v-chart -->
      <el-card v-loading="orderLoading" element-loading-text="載入中，請稍候...">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-medium">最近 {{ selectedDays }} 天的訂單數量</h3>
          <el-select v-model="selectedDays" size="large" style="width: 150px">
            <el-option :label="'最近 7 天'" :value="7" />
            <el-option :label="'最近 14 天'" :value="14" />
            <el-option :label="'最近 30 天'" :value="30" />
          </el-select>
        </div>
        <v-chart :option="chartOption" autoresize style="height: 400px" />
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
// // #region RWD
// @media (max-width: 1500px) {
//   .left-content {
//     .user-content {
//       img {
//         width: 160px;
//         height: 160px;
//       }
//       .user-info {
//         h3 {
//           font-size: 23px;
//         }
//         p {
//           font-size: 22px;
//         }
//       }
//     }
//     .login-info {
//       font-size: 17px;
//     }
//   }
  
//   .card-flex .el-card {
//     width: 49%;
//   }

//   .chart-container {
//     height: 400px;
//   }
// }

// @media (max-width: 800px) {
//   .left-content {
//     .user-content {
//       flex-direction: column;
//       align-items: flex-start;
//       img {
//         width: 150px;
//         height: 150px;
//         margin: 0 auto;
//         margin-bottom: 10px;
//       }
//       .login-info {
//         font-size: 10px;
//       }
//     }
//   }
 
//   .card-flex {
//     flex-direction: column;

//     .el-card {
//       width: 100%;
//     }
//   }

//   .chart-container {
//     height: 300px;
//   }
// }
// // #endregion

</style>
