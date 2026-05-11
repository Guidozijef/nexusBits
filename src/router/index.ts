import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Market from '../views/Market.vue';
import Details from '../views/Details.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/market', component: Market },
  { path: '/details/:id', component: Details },
  { path: '/profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
