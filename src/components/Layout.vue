<template>
    <div class="layout">
      <AppBar v-if="showAppBar" />
      <router-view />
      <BottomNavigation v-if="showBottomNavigation" />
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import AppBar from './AppBar.vue';
  import BottomNavigation from './HomeView.vue';
  
  export default {
    name: 'Layout',
    components: {
      AppBar,
      BottomNavigation
    },
    computed: {
      showAppBar() {
        return this.$route.name !== 'Login' && this.$route.name !== 'SignUp';
      },
      showBottomNavigation() {
        return this.$route.name !== 'Login' && this.$route.name !== 'SignUp';
      }
    }
  };
  </script>
  
  <style scoped>
  .layout {
    padding-top: 60px; /* height of app bar */
  }
  </style>
  