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
        <ErrorPopUp
          v-if="showPopup"
          :visible="showPopup"
          :message="errorMessage"
          @close="showPopup = false"
        />
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import ErrorPopUp from './ErrorPopUp.vue';
  
  export default {
    name: 'Login',
    components: {
      ErrorPopUp
    },
    data() {
      return {
        email: '',
        password: '',
        userData: [],
        statusRq: '',
        id_user: 0,
        user_token: 0,
        budget_id: '0',
        showPopup: false,
        errorMessage: ""
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
          // Getting and saving user login data (user_id and email_user)
          //console.log(response.data)
          this.statusRq = JSON.stringify(response.data)[2]
          this.userData = response.data;
          this.id_user = this.userData['user_id'];
          //console.log(this.id_user)
          //console.log(this.statusRq)
          
          // checking if login is valid
          if (this.statusRq == '0') {
            // showing a popup about incorrect user
            this.errorMessage = 'Email or password does not correct';
            this.showPopup = true;
          } else if (this.id_user > 0){
            // saving user_id in sessionStorage to manage next pages
            this.user_token = this.randomToken(20);
            sessionStorage.setItem('user_id', this.id_user);
            sessionStorage.setItem('authToken', this.user_token);

            // checking if that user_id has any budget created, if it's true, render home page, otherwise, render new_budget page
            try {
              const response = await axios.get(`https://personal-finances-backend.onrender.com/budget/all_budget_user/${this.id_user}`)

              try{
                this.budget_id = response.data[0]['budget_id'];
                if (parseInt(this.budget_id) > 0){
                  this.$router.push({ name: 'Home' });
                } 
              } catch{
                this.$router.push({ name: 'BudgetNew' });
              } 
            } catch(error){
              console.error(error);
            }
          } else {
            // showing a popup about incorrect user
            this.errorMessage = 'Email or password does not correct';
            this.showPopup = true;
          }

          console.log(response.data);
        } catch (error) {
          // Handle error
          console.error(error);
        }
      },
      randomToken(lenToken) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < lenToken; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          randomString += charset[randomIndex];
        }
        return randomString;
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
  