import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export function usePagination(list, defaultSize = 8, autoResize = true) {
  const currentPage = ref(1)
  const pageSize = ref(defaultSize)

  const pagedList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return list.value.slice(start, start + pageSize.value)
  })

  watch(list, () => {
    currentPage.value = 1
  })

  const setPageSizeByScreen = () => {
    const width = window.innerWidth
    pageSize.value = width >= 1600 ? 16 : defaultSize
  }

  if (autoResize) {
    onMounted(() => {
      setPageSizeByScreen()
      window.addEventListener('resize', setPageSizeByScreen)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', setPageSizeByScreen)
    })
  }

  const handlePageChange = (page) => {
    currentPage.value = page
  }

  return {
    currentPage,
    pageSize,
    pagedList,
    handlePageChange,
  }
}
