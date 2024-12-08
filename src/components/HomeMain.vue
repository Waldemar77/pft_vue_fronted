<template>
  <div class="home-view">
    
    <div class="content">
      <div class="current-period">
        Current Period: {{ currentPeriod }}
      </div>

      <div class="budget-section">
        <div class="budget-item" @click="showChart('incomes')">
          <div class="budget-label">Incomes: {{ incomes }}</div>
          <div class="budget-bar">
            <div class="budget-fill incomes" :style="incomesFillStyle"></div>
          </div>
        </div>
        <div class="budget-item" @click="showChart('expenses')">
          <div class="budget-label">Expenses: {{ expenses }}</div>
          <div class="budget-bar">
            <div class="budget-fill expenses" :style="expensesFillStyle"></div>
          </div>
        </div>
      </div>

      <div class="markup">
        Mark Up: {{ markUp }}
      </div>

      <div class="chart-container" v-if="chartData">
        <ChartBars :data="chartData" :options="chartOptions" />
      </div>

    </div>    
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import ChartBars from './ChartBars.vue';

export default {
  components: {
    ChartBars
  },
  data() {
    return {
      id_user: sessionStorage.getItem('user_id'),
      budgetPeriod: '',
      currentPeriod: '',
      periodYear: '',
      numberMonth: '',
      nameMonth: {
        '01':'January', '02':'February', '03':'March', '04':'April', '05':'May', '06':'June',
        '07':'July', '08':'August', '09':'September', '10':'October', '11':'November', '12':'December'
      },
      allBudget: [],
      incomesBudgetCat: {},
      incomeCategories: {1:'Salary', 2:'Rent', 3:'Investment', 4:'Other'},
      expenseCategories: {
        7:'Rent', 8:'Alimentation', 9:'Health', 10:'Services', 11:'Transportation',
        12:'Education', 13:'Pets', 14:'Entertainment', 15:'Other', 16:'Loan Payments'
      },
      incomes: 6000000, // Example incomes value
      incomesBudget: 0, 
      expenses: 400, // Example expenses value
      expensesBudget: 800, // Example expenses budget value,
      markUp: 200, // Example mark up value
      incomesExecution: { 'Salary': 5000000, 'Rent': 500000, 'Investment': 300000, 'Other': 200000 },
      expensesExecution: { 'Rent': 200, 'Alimentation': 100, 'Health': 50, 'Services': 50 },
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          }
        }
      }
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
  mounted() {
    this.getActivePeriod();
  },
  methods: {
    // getting the last active period in the database
    async getActivePeriod() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/budget/all_period_open_user/${this.id_user}`)
        
        this.budgetPeriod = response.data[0]['budget_period']

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

        // getting budget movements
        this.getBudget(this.budgetPeriod)
      } catch(error){
        console.error(error);
      }
    },

    // getting budget for the current period
    async getBudget(periodBudget) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/budget/budget_user_period/${this.id_user}/${periodBudget}`)

        this.allBudget = response.data;
        
        this.allBudget.forEach(element => {
          for (const [key, value] of Object.entries(this.incomeCategories)){
            if (key == element['mov_catg_id']){
              this.incomesBudgetCat[value] = element['budget_value'] 
              this.incomesBudget += parseInt(element['budget_value'])
            }
          }
        });
        console.log(`incomesBugCat: ${Object.keys(this.incomesBudgetCat)}`)
        console.log(`incomesBugCat: ${JSON.stringify(this.incomesBudgetCat)}`)

        this.chartData = {
          labels: Object.keys(incomesBudgetCat),
          datasets: [
            {
              label: 'Budget',
              backgroundColor: '#87CEFA',
              data: Object.values(incomesBudgetCat)
            },
            {
              label: 'Execution',
              backgroundColor: '#000080',
              data: Object.keys(incomesBudgetCat).map(cat => this.incomesExecution[cat] || 0)
            }
          ]
        };
        
      } catch(error){
        console.error(error);
      }
    },
    
    toggleSidebar() {
      // Logic to toggle the sidebar
    },

    showChart(type) {
      let data = {
        labels: [],
        datasets: []
      };
      if (type === 'incomes') {
        data = {
          labels: Object.keys(this.incomesBudgetCat),
          datasets: [
            {
              label: 'Budget',
              backgroundColor: '#87CEFA',
              data: Object.values(this.incomesBudgetCat)
            },
            {
              label: 'Execution',
              backgroundColor: '#000080',
              data: Object.keys(this.incomesBudgetCat).map(cat => this.incomesExecution[cat] || 0)
            }
          ]
        };
      } else if (type === 'expenses') {
        const expensesBudgetCat = Object.keys(this.expenseCategories).reduce((acc, cat) => {
          acc[this.expenseCategories[cat]] = Math.floor(Math.random() * 100); // Placeholder data
          return acc;
        }, {});

        data = {
          labels: Object.keys(this.expenseCategories).map(cat => this.expenseCategories[cat]),
          datasets: [
            {
              label: 'Budget',
              backgroundColor: '#FFECB3',
              data: Object.values(expensesBudgetCat)
            },
            {
              label: 'Execution',
              backgroundColor: '#800000',
              data: Object.keys(this.expenseCategories).map(cat => this.expensesExecution[cat] || 0)
            }
          ]
        };
      }
      this.chartData = data;
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

.chart-container {
  padding: 40px;
  height: 50vh; 
  max-width: 800px; /* or any other value */
  margin: 0 auto; /* center the chart */
}

</style>