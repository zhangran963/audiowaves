import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'audio',
      component: () => import('@/views/AudioView/index.vue')
    }
  ]
})

export default router
