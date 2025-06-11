import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/Login.vue') },
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/MainLayout.vue'),
      redirect: { name: 'home' },
      children: [
        { path: 'home', name: 'home', component: () => import('@/views/Home.vue') },
        { path: 'account', name: 'account', component: () => import('@/views/Account.vue') },
        { path: 'revenue', name: 'revenue', component: () => import('@/views/DailyRevenue.vue') },
        { path: 'product', name: 'product', component: () => import('@/views/ProductManagement.vue') },
        { path: 'order', name: 'order', component: () => import('@/views/OrderManagement.vue') },
        { path: 'member', name: 'member', component: () => import('@/views/MemberManagement.vue') },
        { path: 'finance', name: 'finance', component: () => import('@/views/FinanceDashboard.vue'), meta: { requiresAdmin: true } },
        { path: 'user', name: 'user', component: () => import('@/views/UserManagement.vue'), meta: { requiresAdmin: true } },
      ]
    },
  ],
})

const isAuthorized = (to, role) => {
  if (to.meta.requiresAdmin) {
    return ['admin', 'superadmin'].includes(role)
  }
  return true
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()

  if (!token && to.name !== 'login') {
    return next({ name: 'login' })
  }
  if (token && to.name === 'login') {
    return next({ name: 'home' })
  }
  if (!isAuthorized(to, userStore.role)) {
    ElMessage.warning('您沒有權限進入此頁面')
    return next(false)
  }
  next()
})

export default router