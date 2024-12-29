<template>
  <div class="app-bar">
    <div class="left-section">
      <button class="hamburger" @click="toggleMenu">☰</button>
      <span>{{ title }}</span>
    </div>
    <div class="right-section">
      <button class="buttonHome" @click="goToHome">Home</button>
    </div>
    <div v-if="menuVisible" class="menu">
      <a class="closeX" @click="closeMenu()">x</a>
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
  data() {
    return {
      menuVisible: false,
      panels: {
        incomes: false,
        expenses: false
      }
    };
  },
  methods: {
    togglePanel(panel) {
      this.panels[panel] = !this.panels[panel];
      this.$emit('panel-toggle', { panel, expanded: this.panels[panel] });
    },
    goToHome() {
      // when user click home buton and the panel is extended, we close both panels to show buttomBar
      this.panels['incomes'] = true
      this.panels['expenses'] = true
      this.togglePanel('incomes');
      this.togglePanel('expenses');

      this.$router.push({ name: 'Home' });
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    navigateTo(routeName) {
      this.menuVisible = false;
      this.$router.push({ name: routeName });
    },
    closeMenu() {
      this.menuVisible = false;
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
}

.left-section {
  display: flex;
  align-items: center;
}

.right-section {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.hamburger {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  margin-right: 10px;
}

.buttonHome {
  background: rgb(185, 227, 248);
  border: none;
  color: black;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.closeX {
  background-color: rgb(180, 109, 109);
  text-align: center;
}

.menu {
  position: absolute;
  top: 50px;
  left: 10px;
  background-color: rgb(15, 9, 68);
  border: 1px solid rgb(28, 221, 235);
  box-shadow: 0 4px 8px rgb(28, 221, 235);
}

.menu a {
  display: block;
  padding: 10px;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.menu a:hover {
  background-color: rgb(28, 221, 235);
}

.app-bar h1 {
  margin: 0;
  font-size: 24px;
}
</style>
