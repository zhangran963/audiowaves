import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'audio' }
    },
    {
      path: '/audio',
      name: 'audio',
      component: () => import('../views/AudioView.vue')
    }
  ]
})

export default router
