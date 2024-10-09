<template>
    <div class="signup-container">
      <div class="signup-form">
        <h2>Create a New Account</h2>
        <form @submit.prevent="handleSignUp">
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" v-model="email" required />
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" v-model="password" required />
            </div>
            <div class="input-group">
                <label for="name">Name</label>
                <input type="text" v-model="name" required />
            </div>
            <div class="input-group">
                <label for="lastname">Lastname</label>
                <input type="text" v-model="lastname" required />
            </div>
            <div class="input-group">
                <label for="occupation">Occupation</label>
                <select v-model="occupation" class="custom-select" required>
                    <option disabled value="">Please select one</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Chef">Chef</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Manager">Manager</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Phychologist">Phychologist</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Veterinarian">Veterinarian</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="input-group">
                <label for="location">Country</label>
                <input type="text" v-model="location" required />
            </div>
            <div class="input-group">
              <button type="submit">Sign Up</button>
            </div>
            <div class="input-group">
              <button @click="returnLogin">Return Login</button>
            </div>
          <div v-if="showPopup" class="popup" :class="popupType">
            <p>{{ popupMessage }}</p>
            <button @click="closePopup">OK</button>
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
    name: 'SignUp',
    data() {
      return {
        email: '',
        password: '',
        name: '',
        lastname: '',
        occupation: '',
        location: '',
        showPopup: false,
        popupMessage: '',
        popupType: ''
      };
    },
    setup() {
      const router = useRouter();

      const returnLogin = () => {
        router.push({ name: 'Login' });
      };

      return { returnLogin };

    },
    methods: {
      getCurrentDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      async handleSignUp() {
        try {
          const response = await axios.post('https://personal-finances-backend.onrender.com/login/signup', {
            user_email: this.email,
            user_password: this.password,
            user_name: this.name,
            user_last_name: this.lastname,
            user_occupation_name: this.occupation,
            user_location_name: this.location,
            signup_date: this.getCurrentDate(),
            record_date: ''
          });
          // Handle successful sign-up, e.g., save token, redirect, etc.
          if (response.data.slice(0, 3) == '[2]') {
            this.popupMessage = 'This email already exists in our database.';
            this.popupType = 'error';
            this.showPopup = true;
          } else if (response.data.slice(0, 3) == '[1]'){
            this.popupMessage = 'Your account was created successful!';
            this.popupType = 'success';
            this.showPopup = true;
          }
          console.log(response.data);
        } catch (error) {
          // Handle error
          this.popupMessage = 'Failed to create your account. Please try again.';
          this.popupType = 'error';
          this.showPopup = true;
          console.error(error);
        }
      },
      closePopup() {
        this.showPopup = false;
        if (this.popupType === 'success'){
            this.$router.push({ name: 'Login'});
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .signup-form {
    padding: 2em;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgb(28, 221, 235);
    width: 300px;
  }
  h2 {
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
  .custom-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid rgb(28, 221, 235);
    width: 100%;
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
  