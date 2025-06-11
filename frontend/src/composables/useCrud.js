import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export const useCrud = ({ getApi, addApi, updateApi, deleteApi, formRef, dialog, defaultForm, getTitle }) => {
  const loading = ref(false)
  const list = ref([])

  const fetchData = async () => {
    loading.value = true
    try {
      list.value = await getApi()
    } catch (err) {
      ElMessage.error('資料載入失敗')
    } finally {
      loading.value = false
    }
  }

  const handleAdd = () => {
    dialog.visible = true
    dialog.isEdit = false
    dialog.title = getTitle('add')
    Object.assign(dialog.form, { ...defaultForm })
    formRef.value?.clearValidate()
  }

  const handleEdit = (row) => {
    dialog.visible = true
    dialog.isEdit = true
    dialog.title = getTitle('edit')
    Object.assign(dialog.form, row)
    formRef.value?.clearValidate()
  }

  const submit = async () => {
    try {
      await formRef.value.validate()

      if (dialog.isEdit) {
        const updatedItem = await updateApi(dialog.form.id, dialog.form)
        const index = list.value.findIndex(item => item.id === updatedItem.id)

        if (index !== -1) {
          list.value.splice(index, 1, updatedItem)
        }
        ElMessage.success('編輯成功')
      } else {
        const newItem = await addApi(dialog.form)

        list.value.unshift(newItem)
        list.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        ElMessage.success('新增成功')
      }
      dialog.visible = false
    } catch (error) {
      ElMessage.error(dialog.isEdit ? '編輯失敗' : '新增失敗')
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
      await deleteApi(id)
      list.value = list.value.filter(item => item.id !== id)
      ElMessage.success('刪除成功')
    } catch {
      ElMessage.error('刪除失敗')
    }
  }

  return {
    loading,
    list,
    fetchData,
    handleAdd,
    handleEdit,
    handleDelete,
    submit
  }
}