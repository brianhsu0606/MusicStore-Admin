import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDateStore = defineStore('data', () => {
  const isCollapse = ref(false)

  return { isCollapse }
})
