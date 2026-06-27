import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: '首页' } },
  { path: '/events', name: 'events', component: () => import('@/views/EventsView.vue'), meta: { title: '历史事件' } },
  { path: '/event/:id', name: 'event-detail', component: () => import('@/views/EventDetailView.vue'), meta: { title: '事件详情' } },
  { path: '/figures', name: 'figures', component: () => import('@/views/FiguresView.vue'), meta: { title: '历史人物' } },
  { path: '/figure/:id', name: 'figure-detail', component: () => import('@/views/FigureDetailView.vue'), meta: { title: '人物详情' } },
  { path: '/timeline', name: 'timeline', component: () => import('@/views/TimelineView.vue'), meta: { title: '历史长河' } },
  { path: '/special-81', name: 'special-81', component: () => import('@/views/Special81View.vue'), meta: { title: '八一专题' } },
  { path: '/quiz', name: 'quiz', component: () => import('@/views/QuizView.vue'), meta: { title: '互动问答' } },
  { path: '/leaderboard', name: 'leaderboard', component: () => import('@/views/LeaderboardView.vue'), meta: { title: '排行榜' } },
  { path: '/faq', name: 'faq', component: () => import('@/views/FaqView.vue'), meta: { title: '用户留言' } },
  { path: '/search', name: 'search', component: () => import('@/views/SearchView.vue'), meta: { title: '搜索' } },
  { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { title: '我的' } },
  { path: '/chatbot', name: 'chatbot', component: () => import('@/views/ChatbotView.vue'), meta: { title: '洪小星' } },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: '关于' } },
  { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { title: '注册' } },
  { path: '/3d', name: '3d', component: () => import('@/views/ThreeDView.vue'), meta: { title: '3D 展示' } },
  { path: '/3d2', name: '3d2', component: () => import('@/views/ThreeD2View.vue'), meta: { title: '3D 展示 · 石破天惊' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: '页面不存在' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · 南昌历史云志` : '南昌历史云志'
})

export default router
