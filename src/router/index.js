import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import SignUp from '@/components/SignUp.vue';

/* eslint-disable */
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
