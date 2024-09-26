import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';

/* eslint-disable */
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
