<template>
  <div id="app">
    <router-view></router-view>
    <HomeView v-if="!isAuthRoute" @update="handleNavigationUpdate"/>
  </div>
</template>

<script>
import { computed } from 'vue'; 
import { useRoute } from 'vue-router';
import HomeView from './components/HomeView.vue';

export default {
  name: 'App',
  components: {
    HomeView
  },
  setup() {
    const route = useRoute();
    const isAuthRoute = computed(() => {
      return route.name === 'Login' || route.name ==='SignUp';
    });
    return { isAuthRoute };
  },
  methods: {
    handleNavigationUpdate(activeItem) {
      console.log('Active item:', activeItem);
    }
  }
};
</script>

<style>
body {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  font-size: 17px;
  color: rgb(244, 246, 248);
  margin: 0;
  padding: 0;
  background-color: #474d7ee0;
}
</style>