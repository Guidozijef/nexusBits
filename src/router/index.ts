import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Market from '../views/Market.vue';
import Details from '../views/Details.vue';
import Profile from '../views/Profile.vue';
import AllAssets from '../views/AllAssets.vue';
import Checkout from '../views/Checkout.vue';
import { store } from '../store';

const routes = [
  { path: '/', redirect: '/market' },
  { path: '/login', component: Login },
  { path: '/market', component: Market },
  { path: '/details/:id', component: Details },
  { path: '/checkout/:id', component: Checkout, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/all-assets', component: AllAssets },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Check if session needs to be restored from localStorage first
  if (!store.isLoggedIn) {
    store.initSession();
  }

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && store.isLoggedIn) {
    next('/market');
  } else {
    next();
  }
});

export default router;
