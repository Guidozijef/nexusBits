import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Market from '../views/Market.vue';
import Details from '../views/Details.vue';
import Profile from '../views/Profile.vue';
import AllAssets from '../views/AllAssets.vue';

const routes = [
  { path: '/', redirect: '/market' },
  { path: '/login', component: Login },
  { path: '/market', component: Market },
  { path: '/details/:id', component: Details },
  { path: '/profile', component: Profile },
  { path: '/assets', component: AllAssets },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
