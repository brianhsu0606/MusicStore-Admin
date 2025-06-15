<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useDialogWidth } from '@/composables/useDialogWidth'
import { usePagination } from '@/composables/usePagination'
import { useCrud } from '@/composables/useCrud'
import dayjs from 'dayjs'
import api from '@/api'

const { dialogWidth } = useDialogWidth()

const categories = ['全部商品', '木吉他', '電吉他', '音箱', '配件', '吉他弦']
const categoryOptions = categories.slice(1)
const activeCategory = ref('全部商品')

const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    createdAt: '',
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  }
})
const rules = {
  createdAt : [{ required: true, message: '請選擇進貨日期', trigger: 'blur' }],
  name : [{ required: true, message: '請輸入商品名稱', trigger: 'blur' }],
  category : [{ required: true, message: '請選擇商品分類', trigger: 'blur' }],
  price : [{ required: true, message: '請輸入商品價格', trigger: 'blur' }],
  quantity : [{ required: true, message: '請輸入商品數量', trigger: 'blur' }],
}

const {
  loading,
  list: productList,
  fetchData,
  handleAdd,
  handleEdit,
  handleDelete,
  submit
} = useCrud({
  getApi: api.getProductList,
  addApi: api.addProduct,
  updateApi: api.updateProduct,
  deleteApi: api.deleteProduct,
  formRef,
  dialog,
  defaultForm: {
    createdAt: dayjs().format('YYYY-MM-DD'),
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  },
  getTitle: (type) => (type === 'add' ? '新增商品' : '編輯商品')
})

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
      p.createdAt && p.createdAt.startsWith(selectedMonth.value)
    )
  }
  return list
})
const { currentPage, pageSize, pagedList, handlePageChange } = usePagination(filteredProductList, 8)

// formatter
const formatDate = (_, __, value) => {
  return dayjs(value).format('YYYY-MM-DD')
}
const formatPrice = (row) => {
  return 'NT$ ' + row.price.toLocaleString()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <el-button @click="handleAdd" type="primary">新增商品</el-button>

    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        size="large"
        format="YYYY-MM"
        value-format="YYYY-MM"
        placeholder="選擇月份"
      />
      <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入商品名稱" />
    </div>
  </header>

  <!-- 商品分類 tab -->
  <div class="overflow-auto">
    <el-tabs v-model="activeCategory" type="border-card" class="mb-4 min-w-[900px]" v-loading="loading" element-loading-text="載入中，請稍候...">
      <el-tab-pane
        v-for="item in categories"
        :key="item"
        :label="item"
        :name="item"
      />
      <!-- 商品表格 table -->    
      <el-table :data="pagedList" class="mb-4" stripe>
        <el-table-column prop="createdAt" label="進貨日期" min-width="90" :formatter="formatDate" />
        <el-table-column prop="name" label="商品名稱" min-width="150"/>
        <el-table-column prop="category" label="分類" min-width="70" />
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
  </div>

  <!-- 新增、編輯商品 Dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" :width="dialogWidth">
    <el-form :model="dialog.form" :rules="rules" ref="formRef" label-width="80px" label-position="right">
      <el-form-item prop="createdAt" label="進貨日期">
        <el-date-picker
          v-model="dialog.form.createdAt"
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
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button @click="submit" type="primary">確認</el-button>
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