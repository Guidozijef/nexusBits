import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Market from '../views/Market.vue';
import Details from '../views/Details.vue';
import Profile from '../views/Profile.vue';
import AllAssets from '../views/AllAssets.vue';
import Checkout from '../views/Checkout.vue';
import Support from '../views/Support.vue';

// Admin views
import AdminLayout from '../views/admin/AdminLayout.vue';
import AdminDashboard from '../views/admin/Dashboard.vue';
import AdminUsers from '../views/admin/Users.vue';
import AdminCategories from '../views/admin/Categories.vue';
import AdminProducts from '../views/admin/Products.vue';
import AdminProductEdit from '../views/admin/ProductEdit.vue';
import AdminOrders from '../views/admin/Orders.vue';

import { store } from '../store';

const routes = [
  { path: '/', redirect: '/market' },
  { path: '/login', component: Login },
  { path: '/market', component: Market },
  { path: '/details/:id', component: Details },
  { path: '/checkout/:id', component: Checkout, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/all-assets', component: AllAssets },
  { path: '/support', component: Support },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers },
      { path: 'categories', component: AdminCategories },
      { path: 'products', component: AdminProducts },
      { path: 'products/new', component: AdminProductEdit },
      { path: 'products/:id/edit', component: AdminProductEdit },
      { path: 'orders', component: AdminOrders }
    ]
  }
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
  } else if (to.meta.requiresAdmin && !store.isAdmin) {
    // Wait for fetchProfile to complete if logged in but role isn't loaded
    if (store.isLoggedIn && !store.profile) {
      store.fetchProfile().then(() => {
        if (store.isAdmin) next();
        else next('/');
      }).catch(() => next('/'));
    } else {
      next('/');
    }
  } else if (to.path === '/login' && store.isLoggedIn) {
    next('/market');
  } else {
    next();
  }
});

export default router;
