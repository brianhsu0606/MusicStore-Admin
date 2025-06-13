import { useUserStore } from '@/stores/user'
import api from '@/api'

export const useLoadUserProfile = async () => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')

  if (token && !userStore.id) {
    try {
      const profile = await api.getProfile()
      userStore.setUser(profile)
    } catch (error) {
      localStorage.removeItem('token')
      userStore.clearUser()
    }
  }
  return Promise.resolve()
}
