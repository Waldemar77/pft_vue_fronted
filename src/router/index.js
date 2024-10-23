import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import SignUp from '@/components/SignUp.vue';
import HomeView from '@/components/HomeView.vue';
import BudgetCreate from '@/components/BudgetCreate.vue';

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
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: {title: 'General Summary'}
  },
  {
    path: '/budgetNew',
    name: 'BudgetNew',
    component: BudgetCreate,
    meta: {title: 'Create your Budget'}
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
