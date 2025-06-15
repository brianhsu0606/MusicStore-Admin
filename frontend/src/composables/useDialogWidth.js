import { ref, computed, onMounted, onUnmounted } from 'vue'

export const useDialogWidth = () => {
  const width = ref(window.innerWidth)

  const handleResize = () => {
    width.value = window.innerWidth
  }

  const dialogWidth = computed(() => {
    return width.value < 768 ? '90%' : '50%'
  })

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return { dialogWidth }
}
