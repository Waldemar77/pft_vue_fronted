<template>
    <div class="budget-bar">
      <div class="budget-fill" :style="fillStyle"></div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

  /* eslint-disable */
  export default {
    data() {
      return {
        user_id: 0,
        budgetCategory: 1000, // Example budget category value
        recordsValue: 300 // Example records value
      };
    },
    computed: {
      fillStyle() {
        const percentage = (this.recordsValue / this.budgetCategory) * 100;
        return {
          width: `${percentage}%`
        };
      }
    },
    methods: {
      async getActiveBudget(){
        // saving user_id from the sessionStorage
        this.user_id = sessionStorage.get('user_id')
        
        // getting open budget periods (in correct way, should be open just one)
        const response = await axios.get(`http://127.0.0.1:8000/budget/all_period_open_user/${this.user_id}`)
        
      }
    }
  };
  </script>
  
  <style scoped>
  .budget-bar {
    width: 100%;
    height: 50px; /* Adjust the height as needed */
    background-color: navy; /* Dark blue for budget category */
    position: relative;
  }
  
  .budget-fill {
    height: 100%;
    background-color: #0096FF; /* Bright blue for records value */
    position: absolute;
    top: 0;
    left: 0;
  }
  </style>
  