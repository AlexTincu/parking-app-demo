// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// export default router

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
// import Login from '@/views/Login.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import UserDashboard from '@/views/UserDashboard.vue';
import { authGuard, adminGuard } from '@/router/guards';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: () => import('@/views/Login.vue')}, // lazy-loaded component
  // { path: '/login', component: Login },
  { path: '/admin', component: AdminDashboard, beforeEnter: adminGuard },
  { path: '/user', component: UserDashboard, beforeEnter: authGuard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
