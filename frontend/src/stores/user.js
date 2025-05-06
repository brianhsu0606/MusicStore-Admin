import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    name: '',
    gender: '',
    birth: '',
    email: '',
    avatar: '',
    loginTime: '',
  }),
  actions: {
    setUser(data) {
      this.role = data.role
      this.name = data.name
      this.gender = data.gender
      this.birth = data.birth
      this.email = data.email
      this.avatar = data.avatar
    },
    clearUser() {
      this.$reset()
    },
  },
  persist: true,
})
