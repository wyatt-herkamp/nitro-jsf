import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DebugUploadView from '@/views/DebugUploadView.vue'
import DebugView from '@/views/DebugView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/debug',
      name: 'DebugUploadView',
      component: DebugUploadView
    },
    {
      path: '/debug/:fileContent',
      name: 'debug',
      component: DebugView
    }
  ]
})

export default router
