import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('@/views/VocabularyListView.vue'),
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('@/views/AddEditView.vue'),
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('@/views/AddEditView.vue'),
    },
    {
      path: '/review',
      name: 'review',
      component: () => import('@/views/ReviewView.vue'),
    },
  ],
})

export default router
