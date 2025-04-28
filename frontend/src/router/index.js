import { createRouter, createWebHistory } from 'vue-router'

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
      component: () => import('@/views/Main.vue'),
      redirect: 'home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/Home.vue')
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
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (!token && to.path !== '/login') {
    next('/login')
  } else if (token && to.path === '/login') {
    next('/home')
  } else {
    next()
  }
})

export default router
