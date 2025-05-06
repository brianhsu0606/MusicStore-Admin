<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const categories = ['全部商品', '木吉他', '電吉他', '音箱', '配件']
const activeCategory = ref('全部商品')
const dialog = reactive({
  isEdit: false,
  visible: false,
  title: '',
  form: {
    id: null,
    name: '',
    price: 0,
    quantity: 0,
    category: '木吉他'
  }
})

// #region CRUD
// 載入商品（ Read ）
const products = ref([])
const initProductData = async () => {
  try {
    products.value = await api.getProduct()
  } catch {
    ElMessage.error('獲取商品失敗')
  }
}

onMounted(() => {
  initProductData()
})

// 新增商品（ Create ）
const handleAdd =  () => {
  dialog.visible = true
  dialog.isEdit = false
  dialog.title = '新增商品'
  dialog.form = {
    id: null,
    name: '',
    price: 0,
    quantity: 0,
    category: '木吉他'
  }
}

// 編輯商品（ Update ）
const handleEdit = (row) => {
  dialog.visible = true
  dialog.isEdit = true
  dialog.title = '編輯商品'
  dialog.form = { ...row }
}

const submit = async () => {
  try {
    if (dialog.isEdit) {
      await api.updateProduct(dialog.form, dialog.form.id)
      ElMessage.success('修改成功')
    } else {
      await api.addProduct(dialog.form)
      ElMessage.success('新增成功')
    }
    dialog.visible = false
    initProductData()
  } catch (error) {
    console.error(error)
    ElMessage.error('更新失敗')
  }
}

// 刪除商品（ Delete ）
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('確定要刪除嗎？')
    await api.deleteProduct(id)
    initProductData()
  } catch (error) {
    console.error(error)
    ElMessage.error('刪除失敗')
  }
}
// #endregion CRUD



const formatPrice = (row) => {
  return 'NT$ ' + Number(row.price).toLocaleString()
}

const handleUploadSuccess = (res) => {
  dialog.form.imageUrl = res.imageUrl
  ElMessage.success('圖片上傳成功')
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) ElMessage.error('請上傳圖片檔')
  if (!isLt2M) ElMessage.error('圖片大小不能超過 2MB')

  return isImage && isLt2M
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

// 分頁功能 Pagination
const currentPage = ref(1)
const pageSize = ref(5)
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

watch([searchInput, activeCategory], () => {
  currentPage.value = 1
})

const handlePageChange = (page) => {
  currentPage.value = page
}
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="flex justify-between mb-4">
    <el-button type="primary" @click="handleAdd">新增商品</el-button>
    <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入商品名稱" />
  </header>
  <!-- 商品分類 tab -->
  <el-tabs v-model="activeCategory" type="border-card">
    <el-tab-pane
      v-for="item in categories"
      :key="item"
      :label="item"
      :name="item"
    />
  </el-tabs>
  <!-- 商品表格 table -->
  <el-table :data="pagedProducts" style="width: 100%" class="mb-4">
    <el-table-column label="圖片" width="100">
      <template #default="{ row }">
        <el-image :src="`http://localhost:3000${row.imageUrl}`" fit="cover" style="width: 60px; height: 60px;" class="product-preview"/>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="商品名稱" width="300"/>
    <el-table-column prop="price" label="價格" sortable :formatter="formatPrice"/>
    <el-table-column prop="quantity" label="數量" />
    <el-table-column prop="category" label="分類" />
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
    :current-page="currentPage"
    :page-size="pageSize"
    :total="filteredProducts.length"
    @current-change="handlePageChange"
  />
  <!-- 新增、編輯商品 Dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title">
    <el-form :model="dialog.form">
      <el-form-item label="商品圖片">
        <div class="flex-img">          
          <div v-if="dialog.form.imageUrl" style="margin-top: 10px;">
            <el-image
              :src="`http://localhost:3000${dialog.form.imageUrl}`"
              style="width: 100px; height: 100px;"
              fit="cover"
              class="dialog-img"
            />
          </div>
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/upload" 
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary">選擇圖片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="商品名稱">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item label="價格">
        <el-input v-model.number="dialog.form.price" type="number" />
      </el-form-item>
      <el-form-item label="數量">
        <el-input v-model.number="dialog.form.quantity" type="number" />
      </el-form-item>
      <el-form-item label="分類">
        <el-select v-model="dialog.form.category" placeholder="請選擇分類">
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click="submit">確認</el-button>
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

.el-table {
  .product-preview {
    border: 0.3px solid gray;
  }
}

.flex-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  .dialog-img {
    border: 0.3px solid gray;
  }
}

.el-tabs__nav-wrap {
  flex-grow: 1;
}
</style>

