<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePagination } from '@/composables/usePagination'
import dayjs from 'dayjs'
import api from '@/api'

const categories = ['全部商品', '木吉他', '電吉他', '音箱', '配件', '吉他弦']
const categoryOptions = categories.slice(1)
const activeCategory = ref('全部商品')

const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    lastStockIn: '',
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  }
})
const rules = {
  lastStockIn : [{ required: true, message: '請選擇進貨日期', trigger: 'blur' }],
  name : [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  category : [{ required: true, message: '請選擇商品分類', trigger: 'blur' }],
  price : [{ required: true, message: '請輸入商品價格', trigger: 'blur' }],
  quantity : [{ required: true, message: '請輸入商品數量', trigger: 'blur' }],
}

// #region CRUD
const loading = ref(true)
const productList = ref([])
const fetchProducts = async () => {
  loading.value = true
  try {
    productList.value = await api.getProducts()
  } catch {
    ElMessage.error('獲取商品失敗')
  } finally {
    loading.value = false
  }
}

const handleAdd =  () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增商品'
  Object.assign(dialog.form, {
    lastStockIn: dayjs().format('YYYY-MM-DD'),
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  })
  formRef.value?.clearValidate()
}

const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯商品'
  Object.assign(dialog.form, row)
  formRef.value?.clearValidate()
}

const submit = async () => {
  try {
    await formRef.value.validate()
    if (dialog.isEdit) {
      await api.updateProduct( dialog.form.id, dialog.form)
    } else {
      await api.addProduct(dialog.form)
    }
    dialog.visible = false
    ElMessage.success(dialog.isEdit ? '編輯商品成功' : '新增商品成功')
    await fetchProducts()
  } catch {
    ElMessage.error(dialog.isEdit ? '編輯商品失敗' : '新增商品失敗')
  }
}

const handleDelete = async (id) => {
  const confirmed = await ElMessageBox.confirm('確定要刪除嗎？', '刪除確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => false)
  if (!confirmed) return

  try {
    await api.deleteProduct(id)
    await fetchProducts()
    ElMessage.success('刪除商品成功')
  } catch {
    ElMessage.error('刪除商品失敗')
  }
}
// #endregion

const formatPrice = (row) => {
  return 'NT$ ' + row.price.toLocaleString()
}

// 月份篩選 + 搜尋功能 + 分頁功能
const selectedMonth = ref('')
const searchInput = ref('')

const filteredProductList = computed(() => {
  let list = productList.value
  if (activeCategory.value !== '全部商品') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (searchInput.value.trim()) {
    const keyword = searchInput.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(keyword))
  }
  if (selectedMonth.value) {
    list = list.filter(p =>
      p.lastStockIn && p.lastStockIn.startsWith(selectedMonth.value)
    )
  }
  return list
})
const { currentPage, pageSize, pagedList, handlePageChange } = usePagination(filteredProductList, 8)

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="mb-4 flex justify-between items-center">
    <el-button @click="handleAdd" type="primary">新增商品</el-button>
    <div>
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        size="large"
        format="YYYY-MM"
        value-format="YYYY-MM"
        placeholder="選擇月份"
      />
      <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入商品名稱" class="ml-4" />
    </div>
  </header>

  <!-- 商品分類 tab -->
  <el-tabs v-model="activeCategory" type="border-card" v-loading="loading" element-loading-text="載入中，請稍候...">
    <el-tab-pane
      v-for="item in categories"
      :key="item"
      :label="item"
      :name="item"
    />

    <!-- 商品表格 table -->    
    <el-table :data="pagedList" class="mb-4" stripe>
      <el-table-column prop="lastStockIn" label="進貨日期" min-width="90"/>
      <el-table-column prop="name" label="商品名稱" min-width="170"/>
      <el-table-column prop="category" label="分類" min-width="60" />
      <el-table-column prop="price" label="價格" sortable :formatter="formatPrice"/>
      <el-table-column prop="quantity" label="數量" min-width="50" />
      <el-table-column label="操作" min-width="100">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)" type="primary">編輯</el-button>
          <el-button @click="handleDelete(row.id)" type="danger">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁功能 Pagination -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="filteredProductList.length"
      @current-change="handlePageChange"
    />
  </el-tabs>

  <!-- 新增、編輯商品 Dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title">
    <el-form :model="dialog.form" :rules="rules" ref="formRef" label-width="80px" label-position="right">
      <el-form-item prop="lastStockIn" label="進貨日期">
        <el-date-picker
          v-model="dialog.form.lastStockIn"
          value-format="YYYY-MM-DD"
          placeholder="請選擇日期"
        />
      </el-form-item>
      <el-form-item prop="name" label="商品名稱">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item prop="category" label="分類">
        <el-select v-model="dialog.form.category" placeholder="請選擇分類">
          <el-option v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="price" label="價格">
        <el-input-number v-model.number="dialog.form.price" />
      </el-form-item>
      <el-form-item prop="quantity" label="數量">
        <el-input-number v-model.number="dialog.form.quantity" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submit" type="primary">確認</el-button>
      <el-button @click="dialog.visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
header {
  .el-button {
    height: 38px;
  }
  .el-input {
    width: 250px;
    height: 38px;
    font-size: 16px;
  }
}
</style>