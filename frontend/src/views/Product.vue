<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const categories = ['全部商品', '木吉他', '電吉他', '音箱', '配件', '吉他弦']
const activeCategory = ref('全部商品')

const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  }
})
const rules = {
  name : [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  category : [{ required: true, message: '請選擇商品分類', trigger: 'blur' }],
  price : [{ required: true, message: '請輸入商品價格', trigger: 'blur' }],
  quantity : [{ required: true, message: '請輸入商品數量', trigger: 'blur' }],
}

// #region CRUD
const loading = ref(true)
const products = ref([])
const fetchProducts = async () => {
  loading.value = true
  try {
    products.value = await api.getProducts()
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
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
  } catch (error) { 
    return
  }
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

// 搜尋功能
const searchInput = ref('')
const filteredProducts = computed(() => {
  let list = products.value
  if (activeCategory.value !== '全部商品') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (searchInput.value.trim()) {
    const keyword = searchInput.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(keyword))
  }
  return list
})

// 分頁功能
const currentPage = ref(1)
const pageSize = ref(8)
const handlePageChange = (page) => { currentPage.value = page }

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

watch([searchInput, activeCategory], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="mb-4 flex justify-between items-center">
    <el-button @click="handleAdd" type="primary">新增商品</el-button>
    <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入商品名稱" />
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
    <el-table :data="pagedProducts" class="mb-4" stripe>
      <el-table-column prop="name" label="商品名稱" width="300"/>
      <el-table-column prop="category" label="分類" />
      <el-table-column prop="price" label="價格" sortable :formatter="formatPrice"/>
      <el-table-column prop="quantity" label="數量" />
      <el-table-column label="操作">
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
      :total="filteredProducts.length"
      @current-change="handlePageChange"
    />
  </el-tabs>


  <!-- 新增、編輯商品 Dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title">
    <el-form :model="dialog.form" :rules="rules" ref="formRef">
      <el-form-item prop="name" label="商品名稱">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item prop="category" label="分類">
        <el-select v-model="dialog.form.category" placeholder="請選擇分類">
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
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

