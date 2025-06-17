<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useDialogWidth } from '@/composables/useDialogWidth'
import { usePagination } from '@/composables/usePagination'
import { useCrud } from '@/composables/useCrud'
import dayjs from 'dayjs'
import api from '@/api'

const { dialogWidth } = useDialogWidth()

const formRef = ref()
const dialog = reactive({
  visible: false,
  isEdit: false,
  title: '',
  form: {
    createdAt: '',
    name: '',
    gender: '',
    birth: '',
    addr: '',
  }
})
const rules = {
  createdAt: [{ required: true, message: '請選擇註冊日期', trigger: 'blur' }],
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '請選擇性別', trigger: 'blur' }],
}

const {
  loading,
  dialogLoading,
  list: memberList,
  fetchData,
  handleAdd,
  handleEdit,
  handleDelete,
  submit
} = useCrud({
  getApi: api.getMemberList,
  addApi: api.addMember,
  updateApi: api.updateMember,
  deleteApi: api.deleteMember,
  formRef,
  dialog,
  defaultForm: {
    createdAt: dayjs().format('YYYY-MM-DD'),
    name: '',
    gender: '',
    birth: '',
    addr: ''
  },
  getTitle: (type) => (type === 'add' ? '新增會員' : '編輯會員')
})

const calcAge = (birth) => {
  const today = new Date()
  const birthDate = new Date(birth)

  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  
  if (!birth) {
    return '-'
  }
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// 月份篩選 + 搜尋功能 + 分頁功能
const currentMonth = ref(dayjs().format('YYYY-MM'))
const selectedMonth = ref(currentMonth.value)
const searchInput = ref('')

const filteredMemberList = computed(() => {
  return memberList.value.filter(item => {
    const matchMonth = !selectedMonth.value || dayjs(item.createdAt).format('YYYY-MM') === selectedMonth.value
    const matchSearch = !searchInput.value || item.name.toLowerCase().includes(searchInput.value.toLowerCase())
    return matchMonth && matchSearch
  })
})
const { currentPage, pageSize, pagedList, handlePageChange} = usePagination(filteredMemberList, 8)

// formatter
const formatDate = (_, __, value) => {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-'
}
const formatEmpty = (_, __, value) => {
  return value ? value : '-'
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- 新增、搜尋 header -->
  <header class="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <el-button type="primary" @click="handleAdd" class="order-2 sm:order-1">新增會員</el-button>
    <h3 class="order-1 sm:order2 text-center">{{ selectedMonth ? selectedMonth+' 新增' : '全部'}}會員</h3>
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 order-3">
      <el-date-picker
        v-model="selectedMonth"
        type="month"
        format="YYYY-MM"
        value-format="YYYY-MM"
        size="large"
        placeholder="請選擇月份"
      />
      <el-input v-model="searchInput" prefix-icon="search" placeholder="請輸入會員名稱" />
    </div>
  </header>

  <!-- 會員表格 table -->
  <el-card v-loading="loading" element-loading-text="載入中，請稍候...">
    <div class="overflow-auto">
      <el-table :data="pagedList" class="mb-4 min-w-[940px]" stripe>
        <el-table-column prop="memberId" label="會員ID" min-width="66" />
        <el-table-column prop="createdAt" label="註冊日期" :formatter="formatDate" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="gender" label="性別" min-width="60" />
        <el-table-column label="年齡" min-width="60">
          <template #default="{ row }">{{ calcAge(row.birth) }}</template>
        </el-table-column>
        <el-table-column prop="birth" label="生日" :formatter="formatDate" />
        <el-table-column prop="addr" label="地址" :formatter="formatEmpty" />
        <el-table-column label="操作" min-width="100">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)">編輯</el-button>
            <el-button type="danger" @click="handleDelete(row.id)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分頁功能 Pagination -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="filteredMemberList.length"
      @current-change="handlePageChange"
    />
  </el-card>

  <!-- 新增、編輯會員 Dialog -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" :width="dialogWidth">
    <el-form
      :model="dialog.form"
      :rules="rules"
      ref="formRef"
      label-width="80px"
      label-position="right"
      v-loading="dialogLoading"
      element-loading-text="載入中，請稍候..."
    >
      <el-form-item prop="createdAt" label="註冊日期">
        <el-date-picker 
          v-model="dialog.form.createdAt"
          value-format="YYYY-MM-DD"
          placeholder="請選擇日期"
        />
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item prop="gender" label="性別">
        <el-radio-group v-model="dialog.form.gender" placeholder="請選擇性別">
          <el-radio label="男" value="男" />
          <el-radio label="女" value="女" />
          <el-radio label="其他" value="其他" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="dialog.form.birth"
          value-format="YYYY-MM-DD"
          placeholder="請選擇日期"
        />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="dialog.form.addr" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button @click="submit" type="primary">確認</el-button>
    </template>
  </el-dialog>
</template>