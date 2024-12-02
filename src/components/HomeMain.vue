<template>
  <div class="home-view">
    
    <div class="content">
      <div class="current-period">
        Current Period: {{ currentPeriod }}
      </div>

      <div class="budget-section">
        <div class="budget-item">
          <div class="budget-label">Incomes: {{ incomes }}</div>
          <div class="budget-bar">
            <div class="budget-fill incomes" :style="incomesFillStyle"></div>
          </div>
        </div>
        <div class="budget-item">
          <div class="budget-label">Expenses: {{ expenses }}</div>
          <div class="budget-bar">
            <div class="budget-fill expenses" :style="expensesFillStyle"></div>
          </div>
        </div>
      </div>

      <div class="markup">
        Mark Up: {{ markUp }}
      </div>
    </div>    
  </div>
</template>

<script>
/* eslint-disable */

import axios from 'axios';
export default {
  data() {
    return {
      id_user: sessionStorage.getItem('user_id'),
      currentPeriod: '', // Example period
      periodYear: '',
      numberMonth: '',
      nameMonth: {
        '01':'January', '02':'February', '03':'March', '04':'April', '05':'May', '06':'June',
        '07':'July', '08':'August', '09':'September', '10':'October', '11':'November', '12':'December'
      },
      incomes: 600, // Example incomes value
      incomesBudget: 1000, // Example incomes budget value
      expenses: 400, // Example expenses value
      expensesBudget: 800, // Example expenses budget value,
      markUp: 200 // Example mark up value
    };
  },
  computed: {
    incomesFillStyle() {
      const percentage = (this.incomes / this.incomesBudget) * 100;
      return {
        width: `${percentage}%`
      };
    },
    expensesFillStyle() {
      const percentage = (this.expenses / this.expensesBudget) * 100;
      return {
        width: `${percentage}%`
      };
    }
  },
  created() {
    this.getActivePeriod();
  },
  methods: {
    // getting the last active period in the database
    async getActivePeriod() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/budget/all_period_open_user/${this.id_user}`)
        
        // mapping name month:
        this.periodYear = JSON.stringify(response.data[0]['budget_period']).slice(1,5)
        this.numberMonth = JSON.stringify(response.data[0]['budget_period']).slice(-3,-1)
        //console.log(`periodYear: ${this.periodYear} and numberMonth ${this.numberMonth}`)
        for (const [key, value] of Object.entries(this.nameMonth)) {
          if (key === this.numberMonth){
            this.currentPeriod = this.periodYear + ' - ' + value
          }
        }
        //console.log(`currentPeriod: ${this.currentPeriod}`)
      } catch(error){
        console.error(error);
      }
    },
    
    toggleSidebar() {
      // Logic to toggle the sidebar
    }
  }
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #000;
  color: #fff;
}

.menu-icon {
  cursor: pointer;
}

.title {
  flex: 1;
  text-align: center;
}

.content {
  flex: 1;
  padding: 20px;
  text-align: center;
}

.current-period {
  margin-bottom: 20px;
}

.budget-section {
  margin-bottom: 20px;
}

.budget-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.budget-label {
  margin-bottom: 5px;
}

.budget-bar {
  width: 60%;
  height: 30px;
  background-color: #f0f0f0;
  border: 1px solid #000;
  position: relative;
}

.budget-fill {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.incomes {
  background-color: #87ceeb; /* Light blue */
}

.expenses {
  background-color: #ffebcd; /* Blanched almond */
}

</style>