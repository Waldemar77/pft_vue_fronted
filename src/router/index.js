import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import SignUp from '@/components/SignUp.vue';
import HomeView from '@/components/HomeMain.vue';
import BudgetCreate from '@/components/BudgetCreate.vue';
import MovCreate from '@/components/MovCreate.vue';
import MovDetails from '@/components/MovDetails.vue';

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
  },
  {
    path: '/movementNew',
    name: 'MovementNew',
    component: MovCreate,
    meta: {title: 'Create your Movements'}
  },
  {
    path: '/movDetails',
    name: 'MovDetails',
    component: MovDetails,
    meta: {title: 'Movement Details'}
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// cheking if user has authenticated
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('authToken'); 

  if (to.name !== 'Login' && to.name !== 'SignUp' && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (from.name !== 'Login' && from.name !== 'SignUp' && to.name == 'Login') {
    sessionStorage.clear();
    next();
  } else {
    next();
  }
});

export default router;
