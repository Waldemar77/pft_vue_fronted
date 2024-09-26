<template>
    <div class="login-container">
      <div class="login-form">
        <h2>Personal Finances Tracking</h2>
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" v-model="email" required />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import axios from 'axios';
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post('https://personal-finances-backend.onrender.com/login/login_val/', {
            user_email: this.email,
            user_password: this.password
          });
          // Handle successful login, e.g., save token, redirect, etc.
          console.log(response.data);
        } catch (error) {
          // Handle error
          console.error(error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .login-form {
    padding: 2em;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(87, 244, 255, 0.39);
    width: 300px;
  }
  .login-form h2 {
    margin-bottom: 1em;
    text-align: center;
  }
  .input-group {
    margin-bottom: 1em;
  }
  .input-group label {
    display: block;
    margin-bottom: 0.5em;
  }
  .input-group input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #1800f5;
    border-radius: 4px;
  }
  button {
    width: 100%;
    padding: 0.75em;
    border: none;
    border-radius: 4px;
    background-color: #258d2d;
    color: white;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  button:hover {
    background-color: #95ff3e;
    color: black;
  }
  </style>
  