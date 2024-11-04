<template>
    <div class="app-bar">
      <div class="left-section">
        <button class="hamburger" @click="toggleMenu">☰</button>
        <span>{{ title }}</span>
      </div>
      <div v-if="menuVisible" class="menu">
        <a @click="navigateTo('Profile')">Profile</a>
        <a @click="navigateTo('About')">About</a>
        <a @click="navigateTo('Tutorial')">Tutorial</a>
        <a @click="exitApp">Exit</a>
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  export default {
    name: 'AppBar',
    props: {
      title: {
        type: String,
        required: false
      }
    },
    data(){
      return {
        menuVisible: false
      };
    },
    methods: {
      toggleMenu() {
        this.menuVisible = !this.menuVisible;
      },
      navigateTo(routeName) {
        this.menuVisible = false;
        this.$router.push({ name: routeName });
      },
      exitApp() {
        this.menuVisible = false;
        sessionStorage.clear();
        this.$router.push({ name: 'Login' });
      }
    },
    computed: {
        title() {
            return this.$route.meta.title || 'Pending Title';
        }
    }
  };
  </script>
  
  <style scoped>
  .app-bar {
    background-color: rgb(15, 9, 68);
    color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;*/
  }
  
  .left-section {
    display: flex;
    align-items: center;
  }
  .hamburger {
    background: none;
    border: none;
    font-size: 24px;
    color: white;
    cursor: pointer;
    margin-right: 10px;
  }
  .menu {
    position: absolute;
    top: 50px;
    left: 10px;
    background-color: rgb(15, 9, 68);
    border: 1px solid rgb(28, 221, 235);
    box-shadow: 0 4px 8px rgba(180, 178, 178, 0.822);
  }
  .menu a {
    display: block;
    padding: 10px;
    color: white;
    text-decoration: none;
    cursor: pointer;
  }
  .menu a:hover {
    background-color: rgba(180, 178, 178, 0.822);
  }

  .app-bar h1 {
    margin: 0;
    font-size: 24px;
  }
  </style>
  