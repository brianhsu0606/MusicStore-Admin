<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'
import api from '@/api'

const userStore = useUserStore()

// 圖表設置
const option = reactive({
  textStyle: {
    color: '#333'
  },
  legend: {},
  grid: {
    left: '15%'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLine: {
      lineStyle: {
        color: '#17b3a3'
      }
    },
    axisLabel: {
      interval: 0,
      color: "#333"
    }
  },
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#17b3a3'
        }
      },
    },
  ],
  color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
  series: [],
})
const chartRef = ref(null)

const initHomeData = async () => {
  try {
    const [chartRes] = await Promise.all([
      api.getChartData()
    ])
    const { salesData } = chartRes
    option.xAxis.data = salesData.date
    option.series = Object.keys(salesData.data[0]).map(val => {
      return {
        name: val,
        data: salesData.data.map(item => item[val]),
        type: 'line'
      }
    })
    const oneEchart = echarts.init(chartRef.value)
    oneEchart.setOption(option)
  } catch {
    ElMessage.error('載入資料失敗，請稍後再試')
  }
}

const memberCount = ref(0)
const fetchMemberCount = async () => {
  try {
    const memberList = await api.getMembers()
    memberCount.value = memberList.length
  } catch (error) {
    ElMessage.error('獲取用戶數量失敗')
  }
}

const orderCount = ref(0)
const fetchOrderCount = async () => {
  try {
    const orderList = await api.getOrders()
    orderCount.value = orderList.filter(item => item.status === 'processing').length
  } catch (error) {
    ElMessage.error('獲取訂單數量失敗')
  }
}

const productList = ref([])
const productStock = ref([])
const fetchProductStock = async () => {
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
  }
}

onMounted(() => {
  fetchMemberCount()
  fetchOrderCount()
  fetchProductStock()
  initHomeData()
})

const roleMap = {
  admin: '管理員',
  user: '職員'
}
const roleText = computed(() => roleMap[userStore.role] || '未知角色')

const cardData = [
  { icon: 'User', bg: 'bg-green-400', title: '會員人數：', value: () => memberCount.value + ' 人' },
  { icon: 'Document', bg: 'bg-blue-400', title: '未出貨訂單：', value: () => orderCount.value },
]
</script>

<template>
  <el-row :gutter="20">
    <!-- 左側 -->
    <el-col :span="10" class="left-content">
      <!-- 左側上方 登入資訊 -->
      <el-card class="mb-4">
        <div class="user-content flex items-center">
          <img :src="`/images/avatars/${userStore.avatar}`">
          <div class="user-info">
            <h3>{{ userStore.name }}</h3>
            <p>{{ roleText }}</p>
          </div>
        </div>
        <p class="mt-4 font-medium text-lg text-gray-500">上次登入時間：{{ userStore.loginTime }}</p>
      </el-card>
      <!-- 左側下方 表格資料 el-table -->
      <el-card>
        <el-table :data="productStock" stripe>
          <el-table-column prop="category" label="分類" />
          <el-table-column prop="quantity" label="庫存量">
            <template #default="{ row }">
              <span :class="{ 'text-red-500 font-semibold': row.quantity < 10 }">
                {{ row.quantity }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 右側 -->
    <el-col :span="14" class="right-content">
      <!-- 右邊上方 基本資料區 el-card -->
      <div class="flex gap-4 mb-4">
        <el-card v-for="(item, index) in cardData" :key="index">
          <div class="flex items-center gap-4">
            <el-icon :size="50" :class="`${item.bg} rounded-lg p-1`">
              <component :is="item.icon" />
            </el-icon>
            <div class="card-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.value() }}</p>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右邊中間 echarts -->
      <el-card>
        <template #header>
          <h3 class="echart-title">吉他銷售量折線圖</h3>
        </template>
        <div ref="chartRef" class="chart-container"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
// 左側
.left-content {
  .user-content {
    padding-bottom: 20px;
    border-bottom: 1px solid gray;
    img {
      width: 180px;
      height: 180px;
      border-radius: 30px;
      margin-right: 30px;
      border: 1px solid gray;
      box-shadow: 1px 1px 3px gray;
    }
    .user-info {
      h3 {
        font-size: 30px;
        font-weight: 500;
      }
      p {
        font-size: 24px;
        color: gray;
      }
    }
  }
}
.el-card {
  transition: all 0.2s ease;
  &:hover {
    box-shadow: 3px 3px 5px gray;
    transform: scale(1.01);
  }
}

.card-info {
  h3 {
    font-size: 20px;
  }
  p {
    font-size: 20px;
    font-weight: 500;
    color: gray;
  }
}

// 右側
.card-flex {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 3px;
  .el-card {
    width: 32%;
    margin-bottom: 15px;
    .card-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .icons {
        width: 60px;
        height: 60px;
        margin-right: 20px;
      }
      h3 {
        font-size: 20px;
        font-weight: 500;
      }
      p {
        font-size: 19px;
        color: gray
      }
    }
  }
}
.echart-title {
    text-align: center;
    font-size: 20px;
}
.chart-container {
  height: 480px;
}

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