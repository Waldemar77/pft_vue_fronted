<template>
    <header class="app-bar">
      <h1>{{ title }}</h1>
    </header>
  </template>
  
  <script>
  /* eslint-disable */
  export default {
    name: 'AppBar',
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
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  
  .app-bar h1 {
    margin: 0;
    font-size: 24px;
  }
  </style>
  