import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, adminGuard } from '@/router/guards'

// import HomeView from '../views/HomeView.vue'
import HomePage from '../views/HomePage.vue'
// import Login from '@/views/Login.vue';
import AdminDashboard from '@/views/AdminDashboard.vue'
import UserDashboard from '@/views/UserDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    { path: '/login', component: () => import('@/views/Login.vue') }, // lazy-loaded component
    { path: '/register', component: () => import('@/views/Register.vue') }, // lazy-loaded component
    // { path: '/login', component: Login },
    { path: '/user', component: UserDashboard, beforeEnter: authGuard },
    { path: '/admin', component: AdminDashboard, beforeEnter: adminGuard },
  ],
})

export default router
