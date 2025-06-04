import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const id = ref('')
  const role = ref('')
  const name = ref('')
  const gender = ref('')
  const birth = ref('')
  const email = ref('')
  const avatar = ref('')

  function setUser(data) {
    id.value = data.id
    role.value = data.role
    name.value = data.name
    gender.value = data.gender
    birth.value = data.birth
    email.value = data.email
    avatar.value = data.avatar
  }

  function clearUser() {
    id.value = ''
    role.value = ''
    name.value = ''
    gender.value = ''
    birth.value = ''
    email.value = ''
    avatar.value = ''
  }

  return {
    id,
    role,
    name,
    gender,
    birth,
    email,
    avatar,
    setUser,
    clearUser
  }
}, { persist: true })