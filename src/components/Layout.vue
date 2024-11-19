<template>
    <div class="layout">
      <AppBar v-if="showAppBar" />
      <router-view @panel-toggle="handlePanelToggle" />
      <BottomNavigation v-if="showBottomBar"/>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import AppBar from './AppBar.vue';
  import BottomNavigation from './BottomBar.vue';
  
  export default {
    name: 'Layout',
    data() {
      return {
        showBottomBar: false,
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
      },

      showBottomBarDef() {
        this.showBottomBar = this.$route.name !== 'Login' && this.$route.name !== 'SignUp';
        return this.showBottomBar;
      }
    },
    methods: {
      handlePanelToggle({ panel, expanded }) {
        if (panel === 'incomes') {
          this.incomePanelExpanded = expanded;
        } else if (panel === 'expenses') {
          this.expensePanelExpanded = expanded;
        }
        // console.log(`panel: ${panel} is extended?: ${expanded}`)
        // setting visibility of BottomBarNavigation
        if (this.incomePanelExpanded==true || this.expensePanelExpanded==true){
          this.showBottomBar = false  
        } else if (this.incomePanelExpanded==false && this.expensePanelExpanded==false) {
          this.showBottomBar = true
        } 
      }
    },
    watch: {
    $route(to, from) {
      // Update the bottom bar visibility when the route changes
      this.showBottomBar = this.$route.name !== 'Login' && this.$route.name !== 'SignUp' && !this.incomePanelExpanded && !this.expensePanelExpanded;
      },
      incomePanelExpanded(val) {
      // Update the bottom bar visibility when income panel expands or collapses
      this.showBottomBar = this.$route.name !== 'Login' && this.$route.name !== 'SignUp' && !val && !this.expensePanelExpanded;
      },
      expensePanelExpanded(val) {
        // Update the bottom bar visibility when expense panel expands or collapses
        this.showBottomBar = this.$route.name !== 'Login' && this.$route.name !== 'SignUp' && !val && !this.incomePanelExpanded;
      }
    }
  };
  </script>
  
  <style scoped>
  .layout {
    padding-top: 60px; /* height of app bar */
  }
  </style>
  