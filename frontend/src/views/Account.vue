<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import api from '@/api'

const userStore = useUserStore()

const form = reactive({
  role: userStore.role,
  name: userStore.name,
  gender: userStore.gender,
  birth: userStore.birth,
  email: userStore.email,
  avatar: userStore.avatar
})

const handleUpdate = async () => {
  try {
    await api.updateProfile(form)
    userStore.setUser({
      ...userStore,
      ...form
    })
    ElMessage.success('更新成功')
  } catch (error) {
    ElMessage.error('更新失敗')
  }
}

const roleLabel = {
  superadmin: '超級管理員',
  admin: '管理員',
  user: '職員'
}

const dialogVisible = ref(false)
const selectAvatar = (avatarFileName) => {
  form.avatar = avatarFileName
  dialogVisible.value = false
}
</script>

<template>
  <el-card>
    <h3>帳戶資訊</h3>
    <img 
      :src="`/images/avatars/${form.avatar}`"
      @click="dialogVisible = true" 
      class="avatar-preview"
    />

    <!-- 基本資料表單 form -->
    <el-form>
      <el-form-item label="身份">
        <el-input v-model="roleLabel[form.role]" disabled />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="性別">
        <el-radio-group v-model="form.gender" placeholder="請選擇性別">
          <el-radio label="男" value="male" />
          <el-radio label="女" value="female" />
          <el-radio label="其他" value="others" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日">
        <el-date-picker
          v-model="form.birth"
          value-format="YYYY-MM-DD"
          style="width: 100%;"
          placeholder="請選擇日期"
        />
      </el-form-item>
      <el-form-item label="信箱">
        <el-input v-model="form.email" type="email"/>
      </el-form-item>
    </el-form>
    <footer class="flex justify-end">
      <el-button @click="handleUpdate" type="primary">更新</el-button>
    </footer>
  </el-card>

  <!-- 選擇頭貼 Dialog -->
  <el-dialog v-model="dialogVisible" title="選擇頭貼" width="800">
    <div class="flex justify-between">
      <img
        v-for="i in 5"
        :key="i"
        :src="`/images/avatars/avatar${i}.jpg`"
        @click="selectAvatar(`avatar${i}.jpg`)"
      />
    </div>
  </el-dialog>
</template>

<style scoped lang="less">
.el-card {
  max-width: 500px;
  margin: 20px auto;
  padding: 10px 20px;

  h3 {
    font-size: 24px;
    font-weight: 500;
  }
  .avatar-preview {
    width: 150px;
    height: 150px;
    border: 1px solid rgb(172, 172, 172);
    border-radius: 50%;
    margin: 20px auto;
    display: block;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      box-shadow: 1px 1px 6px gray;
    }
  }
  .el-form {
    .el-input {
      font-size: 16px;
      height: 36px;
    }
  }
}

.el-dialog {
  img {
    width: 130px;
    height: 130px;
    border: 1px solid rgb(172, 172, 172);
    border-radius: 15px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      box-shadow: 1px 1px 4px gray;
    }
  }
}
</style>