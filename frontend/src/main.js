import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import router from './router'
import { useLoadUserProfile } from '@/composables/useLoadUserProfile'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import VueECharts from 'vue-echarts'
import * as echarts from 'echarts'

import '@/assets/main.less'

async function bootstrap() {
  const app = createApp(App)

  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  await useLoadUserProfile()

  app.use(router)
  app.use(ElementPlus)
  app.component('VChart', VueECharts)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.mount('#app')

  const loadingEl = document.getElementById('loading')
  if (loadingEl) loadingEl.remove()
}

bootstrap()