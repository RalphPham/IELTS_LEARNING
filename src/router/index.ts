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
    {
      path: '/grammar',
      name: 'grammar-hub',
      component: () => import('@/views/GrammarHubView.vue'),
    },
    {
      path: '/grammar/import',
      name: 'grammar-import',
      component: () => import('@/views/GrammarImportView.vue'),
    },
    {
      // Mixed test — uses a sentinel id 'mixed' read by the practice view
      path: '/grammar/mixed',
      name: 'grammar-mixed',
      component: () => import('@/views/GrammarPracticeView.vue'),
      props: { id: 'mixed' },
    },
    {
      // Special topic: tense coordination — must come before /grammar/:id
      path: '/grammar/sequencing',
      name: 'grammar-sequencing',
      component: () => import('@/views/GrammarSequencingView.vue'),
    },
    {
      path: '/grammar/:id',
      name: 'grammar-tense',
      component: () => import('@/views/GrammarTenseView.vue'),
    },
    {
      path: '/grammar/:id/practice',
      name: 'grammar-practice',
      component: () => import('@/views/GrammarPracticeView.vue'),
    },
  ],
})

export default router
