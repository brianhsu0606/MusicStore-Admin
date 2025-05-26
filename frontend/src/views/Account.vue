<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import api from '@/api'
const userStore = useUserStore()

const formatValue = (val) => val === '-' ? '' : val
const formData = ref({
  role: userStore.role,
  name: formatValue(userStore.name),
  gender: formatValue(userStore.gender),
  birth: formatValue(userStore.birth),
  email: formatValue(userStore.email),
  avatar: userStore.avatar
})

const formatEmpty = (val) => val === '' ? '-' : val
const handleUpdate = async () => {
  const payload = {
    ...formData.value,
    name: formatEmpty(formData.value.name),
    gender: formatEmpty(formData.value.gender),
    birth: formatEmpty(formData.value.birth),
    email: formatEmpty(formData.value.email),
  }

  try {
    await api.updateProfile(payload)
    userStore.setUser(payload)
    ElMessage.success('更新成功')
  } catch (err) {
    ElMessage.error('更新失敗')
  }
}

const roleLabels = {
  superadmin: '超級管理員',
  admin: '管理員',
  user: '職員'
}

const dialogVisible = ref(false)
const selectAvatar = (avatarFileName) => {
  formData.value.avatar = avatarFileName
  dialogVisible.value = false
}
</script>

<template>
  <div class="container">
    <h3>帳戶資訊</h3>
    <!-- 頭貼 -->
    <img 
      :src="`/images/avatars/${formData.avatar}`"
      class="avatar-preview"
      @click="dialogVisible = true" 
    />
    <!-- 彈出 Dialog 選擇頭貼 -->
    <el-dialog v-model="dialogVisible" title="選擇頭貼" width="850">
      <div class="avatar-list">
        <img
          v-for="i in 5"
          :key="i"
          :src="`/images/avatars/avatar${i}.jpeg`"
          @click="selectAvatar(`avatar${i}.jpeg`)"
        />
      </div>
    </el-dialog>
    <!-- 帳戶資訊 el-form -->
    <el-form label-width="80px">
      <el-form-item label="身份">
        <el-input v-model="roleLabels[formData.role]" disabled />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="性別">
        <el-select v-model="formData.gender" placeholder="選擇性別">
          <el-option label="男" value="male" />
          <el-option label="女" value="female" />
        </el-select>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="formData.birth"
          type="date"
          placeholder="選擇日期"
          format="YYYY / MM / DD"
          value-format="YYYY / MM / DD"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="信箱">
        <el-input v-model="formData.email" type="email"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleUpdate">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 40px;
  border: 1px solid gray;
  border-radius: 20px;
  box-shadow: 3px 3px 3px gray;
  background-color: rgb(255, 228, 193);
  h3 {
    font-size: 24px;
    font-weight: 500;
  }
  .avatar-preview {
    width: 250px;
    height: 200px;
    border: 1px solid gray;
    border-radius: 10px;
    margin: 20px auto;
    display: block;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      box-shadow: 1px 1px 5px gray;
    }
  }
  .el-dialog img {
    width: 150px;
    height: 150px;
    margin: 0 5px;
    cursor: pointer;
    &:hover {
      border: 1px solid ;
      box-shadow: 1px 1px 5px gray;
    }
  }
  .el-form {
    .el-input {
      font-size: 16px;
      height: 35px;
    }
  }
}
</style>