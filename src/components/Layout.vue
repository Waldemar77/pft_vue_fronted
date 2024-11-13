<template>
    <div class="layout">
      <AppBar v-if="showAppBar" />
      <router-view @panel-toggle="handlePanelToggle" />
      <BottomNavigation v-if="showBottomBar" />
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import AppBar from './AppBar.vue';
  import BottomNavigation from './HomeView.vue';
  
  export default {
    name: 'Layout',
    data() {
      return {
        showBottomBar: true,
        incomePanelExpanded: false,
        expensePanelExpanded: false,
      }
    },
    components: {
      AppBar,
      BottomNavigation
    },
    computed: {
      showAppBar() {
        return this.$route.name !== 'Login' && this.$route.name !== 'SignUp';
      }
    },
    methods: {
      handlePanelToggle({ panel, expanded }) {
        if (panel === 'incomes') {
          this.incomePanelExpanded = expanded;
        } else if (panel === 'expenses') {
          this.expensePanelExpanded = expanded;
        }
        // setting visibility of BottomBarNavigation
        if (this.incomePanelExpanded==true || this.expensePanelExpanded==true){
          this.showBottomBar = false  
        } else if (this.incomePanelExpanded==false && this.expensePanelExpanded==false) {
          this.showBottomBar = true
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .layout {
    padding-top: 60px; /* height of app bar */
  }
  </style>
  