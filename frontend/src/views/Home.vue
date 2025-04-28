<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'
import api from '@/api'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const tableLabel = [
  { prop: 'name', label: '種類' },
  { prop: 'todayBuy', label: '當日購買' },
  { prop: 'monthBuy', label: '當月購買' },
  { prop: 'totalBuy', label: '總共購買' },
]
const tableData = ref([])
const countData = ref([])

// 圖表設置
const option = reactive({
  // 全局字體樣式
  textStyle: {
    color: '#333'
  },
  // 圖例
  legend: {},
  // 圖表區域邊距
  grid: {
    left: '15%'
  },
  // 滑鼠提示
  tooltip: {
    trigger: 'axis'
  },
  // X 軸
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
  // Y 軸
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
    const [tableRes, countRes, chartRes] = await Promise.all([
      api.getTableData(),
      api.getCountData(),
      api.getChartData()
    ])
    tableData.value = tableRes.tableData
    countData.value = countRes.countData
  
    const { stockData } = chartRes
    option.xAxis.data = stockData.date
    option.series = Object.keys(stockData.data[0]).map(val => {
      return {
        name: val,
        data: stockData.data.map(item => item[val]),
        type: 'line'
      }
    })
    const oneEchart = echarts.init(chartRef.value)
    oneEchart.setOption(option)
  } catch {
    ElMessage.error('載入資料失敗，請稍後再試')
  }
}

onMounted(() => {
  initHomeData()
})
</script>

<template>
  <el-row :gutter="20">
    <!-- 左側 -->
    <el-col :span="8" class="left-content">
      <!-- 左側上方 登入資訊 -->
      <el-card>
        <div class="user-content">
          <img :src="`/images/avatars/${userStore.avatar}`">
          <div class="user-info">
            <h3>{{ userStore.name }}</h3>
            <p>超級管理員</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登入時間：{{ userStore.loginTime }}</p>
          <p>上次登入地點：京都</p>
        </div>
      </el-card>
      <!-- 左側下方 表格資料 el-table -->
      <el-card>
        <el-table :data="tableData" stripe>
          <el-table-column
            v-for="item in tableLabel"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
          />
        </el-table>
      </el-card>
    </el-col>
    <!-- 右側 -->
    <el-col :span="16" class="right-content">
      <!-- 右側上方 el-card -->
      <div class="card-flex">
        <el-card v-for="item in countData" :key="item.name">
          <div class="card-container">
            <component :is="item.icon" class="icons" :style="{ background: item.color }"></component>
            <div>
              <h3>項目：{{ item.name }}</h3>
              <p>金額：NT {{ item.value }}</p>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 右邊中間 echarts -->
      <el-card>
        <div ref="chartRef" class="chart-container"></div>
      </el-card>
    </el-col>

  </el-row>
</template>

<style scoped lang="less">
// 左側
.left-content {
  .el-card {
    margin-bottom: 18px;
    transition: 0.2s;
  }
  .user-content {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid gray;
    img {
      width: 200px;
      height: 200px;
      border-radius: 30px;
      margin-right: 30px;
      border: 1px solid gray;
      box-shadow: 1px 1px 3px gray;
    }
    .user-info {
      h3 {
        font-size: 24px;
        font-weight: 500;
      }
      p {
        font-size: 18px;
        color: gray;
      }
    }
  }
  .login-info {
    margin-top: 14px;
    font-size: 17px;
    color: gray;
  }
}

.el-card:hover {
  box-shadow: 3px 3px 5px gray;
  transform: scale(1.01);
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

.chart-container {
  height: 480px;
}

// #region RWD
@media (max-width: 1500px) {
  .left-content {
    .user-content {
      img {
        width: 160px;
        height: 160px;
      }
      .user-info {
        h3 {
          font-size: 22px;
        }
        p {
          font-size: 18px;
        }
      }
    }
    .login-info {
      font-size: 17px;
    }
  }
  
  .card-flex .el-card {
    width: 49%;
  }

  .chart-container {
    height: 400px;
  }
}

@media (max-width: 800px) {
  .left-content {
    .user-content {
      flex-direction: column;
      align-items: flex-start;
      img {
        width: 150px;
        height: 150px;
        margin: 0 auto;
        margin-bottom: 10px;
      }
      .login-info {
        font-size: 10px;
      }
    }
  }
 
  .card-flex {
    flex-direction: column;

    .el-card {
      width: 100%;
    }
  }

  .chart-container {
    height: 300px;
  }
}
// #endregion RWD
</style>