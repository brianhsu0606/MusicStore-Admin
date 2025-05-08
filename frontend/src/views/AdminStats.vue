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

const productCount = ref(0)
const getProductCount = async () => {
  try {
    const productList = await api.getProducts()
    productCount.value = productList.length
  } catch {
    ElMessage.error('獲取商品數量失敗')
  }
}

// #region 成本 cost
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

const newCost = ref({name: '', price: 0})
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
  getProductCount()
})
</script>

<template>
  <div class="flex justify-start gap-4 mb-4">
    <el-card>
      <h3>本月營業額：</h3>
      <p>金額：NT {{ totalRevenue.toLocaleString() }}</p>
    </el-card>
    <el-card>
      <h3>本月成本</h3>
      <p>金額：NT {{ totalCost.toLocaleString() }}</p>
    </el-card>
    <el-card>
      <h3>本月淨利潤：</h3>
      <p>金額：NT{{ (totalRevenue - totalCost).toLocaleString() }}</p>
    </el-card>
  </div>

  <el-row class="mb-4">
    <el-col :span="12">
      <!-- 成本資料 -->
      <el-card>
        <h3>成本資料</h3>
        <!-- 新增成本 form -->
        <el-form>
          <el-form-item label="成本名稱">
            <el-input v-model="newCost.name" placeholder="請輸入成本項目" />
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
          <el-table-column prop="price" label="金額" :formatter="formatPrice" />
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
        <h3>營業額資料</h3>
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
          <el-table-column prop="price" label="金額" :formatter="formatPrice" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button @click="handleDeleteRevenue(row.id)" type="danger">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>  
    </el-col>
  </el-row>

  <el-card>
    <p>目前會員數量：{{ memberCount }}</p>
    <p>目前樂器庫存：{{ productCount }}</p>
  </el-card>

</template>