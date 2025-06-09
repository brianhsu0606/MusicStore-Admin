import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/MainLayout.vue'),
      redirect: 'home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'revenue',
          name: 'revenue',
          component: () => import('@/views/DailyRevenue.vue')
        },
        {
          path: 'member',
          name: 'member',
          component: () => import('@/views/Member.vue')
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('@/views/Account.vue')
        },
        {
          path: 'product',
          name: 'product',
          component: () => import('@/views/Product.vue')
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('@/views/OrderManagement.vue')
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/UserManagement.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'admin-stats',
          name: 'admin-stats',
          component: () => import('@/views/AdminStats.vue'),
          meta: { requiresAdmin: true },
        },
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

  if (!token && to.path !== '/login') {
    return next('/login')
  }

  if (token && to.path === '/login') {
    return next('/home')
  }

  if (!isAuthorized(to, userStore.role)) {
    ElMessage.warning('您沒有權限進入此頁面')
    return next(false)
  }
  next()
})

export default router