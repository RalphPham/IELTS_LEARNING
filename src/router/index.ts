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
      path: '/week/:week',
      name: 'weekly-review',
      component: () => import('@/views/WeeklyReviewView.vue'),
    },
    {
      path: '/topic-practice',
      name: 'topic-practice',
      component: () => import('@/views/TopicPracticeView.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/StatisticsView.vue'),
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
      // Generic special-topic detail (sequencing, future_forms, have_got, used_to, pp_vs_past)
      path: '/grammar/topic/:topicId',
      name: 'grammar-topic',
      component: () => import('@/views/GrammarTopicView.vue'),
    },
    {
      path: '/grammar/topic/:topicId/practice',
      name: 'grammar-topic-practice',
      component: () => import('@/views/GrammarPracticeView.vue'),
    },
    {
      // Back-compat: old sequencing URLs redirect into the generic topic routes
      path: '/grammar/sequencing',
      redirect: '/grammar/topic/sequencing',
    },
    {
      path: '/grammar/sequencing/practice',
      redirect: '/grammar/topic/sequencing/practice',
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
