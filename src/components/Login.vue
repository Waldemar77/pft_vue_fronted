<template>
    <div class="login-container">
      <div class="login-form">
        <div class="header">
          <img src="@/assets/pft_logo.png" alt="Logo" class="logo" />
          <h3>Personal Finances Tracking</h3>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" v-model="email" required />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" required />
          </div>
          <div class="input-group">
            <button type="submit">Login</button>
          </div>
          <div class="input-group">
            <button @click="goToSignUp">Create an Account</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: ''
      };
    },
    setup() {
      const router = useRouter();

      const goToSignUp = () => {
        router.push({ name: 'SignUp' });
      };

      return { goToSignUp };
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
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1em;
  }
  .logo {
    width: 80px;
    margin-right: 1em;
  }
  .login-form {
    padding: 2em;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgb(28, 221, 235);
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
    width: 95%;
    padding: 0.5em;
    border: 1px solid rgb(28, 221, 235);
    border-radius: 4px;
  }
  .input-group button {
    width: 100%;
    padding: 0.5em;
    border: 1px solid rgb(28, 221, 235);
    border-radius: 4px;
  }
  button {
    width: 100%;
    padding: 0.5em;
    border: none;
    border-radius: 4px;
    background-color: rgb(28, 221, 235);
    color: black;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  button:hover {
    background-color: #95ff3e;
    color: black;
  }
  </style>
  