<template>
  <Layout />
</template>

<script>
import Layout from './components/Layout.vue';

export default {
  name: 'App',
  components: {
    Layout
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
  background-color: #366369e0;
}
</style>