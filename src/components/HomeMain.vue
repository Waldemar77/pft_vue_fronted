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
          <div class="budget-bar-exp">
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
      incomesMovCat: {},
      expensesBudgetCat: {},
      expensesMovCat: {},
      incomesBudgetCatSort: {},
      incomesMovCatSort: {},
      expensesBudgetCatSort: {},
      expensesMovCatSort: {},
      incomeCategories: {1:'Salary', 2:'Rent', 3:'Investment', 4:'Other'},
      expenseCategories: {
        7:'Rent', 8:'Alimentation', 9:'Health', 10:'Services', 11:'Transportation', 12:'Education', 13:'Pets', 14:'Entertainment', 15:'Other', 16:'Loan Payments'
      },
      allCategories: {
        1:'Salary', 2:'Rent', 3:'Investment', 4:'Other', 7:'Rent', 8:'Alimentation', 9:'Health', 10:'Services', 11:'Transportation', 12:'Education', 13:'Pets', 14:'Entertainment', 15:'Other', 16:'Loan Payments'
      },
      incomes: 0,
      incomesBudget: 0, 
      expenses: 0,
      expensesBudget: 0,
      markUp: 0,
      chartData: null,
      chartOptions: {
        responsive: true,
        indexAxis: 'x',
        maintainAspectRatio: false,
        scales: {
          x: {},
          y: {
            beginAtZero: true
          }
        }
      }
    };
  },
  computed: {
    incomesFillStyle() {
      const percentage = (this.incomes / this.incomesBudget) * 100;
      if (percentage >= 100){
        return {
          width: '100%',
          backgroundColor: '#95ff3e' 
        };
      } else {
        return {
          width: `${percentage}%`
        };
      }
    },
    expensesFillStyle() {
      const percentage = (this.expenses / this.expensesBudget) * 100;
      if (percentage >= 100){
        return {
          width: '100%',
          backgroundColor: '#f56464' 
        };
      } else {
        return {
          width: `${percentage}%`
        };
      }
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
        //saving current period in SessionStorage
        sessionStorage.setItem('activePeriod', this.currentPeriod)

        // getting budget movements
        this.getBudgetAndMov(this.budgetPeriod)
      } catch(error){
        console.error(error);
      }
    },

    // getting budget and movements for the current period
    async getBudgetAndMov(periodBudget) {
      try {
        // getting budget data
        const response = await axios.get(`http://127.0.0.1:8000/budget/budget_user_period/${this.id_user}/${periodBudget}`)

        this.allBudget = response.data;
        
        this.allBudget.forEach(element => {
          for (const [key, value] of Object.entries(this.allCategories)){
            if (key == element['mov_catg_id'] && key <= 4){
              // checking if that movement already exist, if it's true, adding
              if (value in this.incomesBudgetCat){
                this.incomesBudgetCat[value] += parseInt(element['budget_value'])
                this.incomesBudget += parseInt(element['budget_value'])
              } else {
                // setting incomes budget data
                this.incomesBudgetCat[value] = parseInt(element['budget_value'])
                this.incomesBudget += parseInt(element['budget_value'])
              } 
            } else if(key == element['mov_catg_id'] && key > 4) {
              // checking if that movement already exist, if it's true, adding
              if (value in this.expensesBudgetCat){
                this.expensesBudgetCat[value] += parseInt(element['budget_value'])
                this.expensesBudget += parseInt(element['budget_value'])
              } else {
                // setting incomes budget data
                this.expensesBudgetCat[value] = parseInt(element['budget_value'])
                this.expensesBudget += parseInt(element['budget_value'])
              }
            }
          }
        });

        // getting movements data
        const response_mov = await axios.get(`http://127.0.0.1:8000/mov/mov_user_period/${this.id_user}/${periodBudget}`)

        this.allMovements = response_mov.data;
        
        // setting incomes movement data
        this.allMovements.forEach(element => {
          for (const [key, value] of Object.entries(this.allCategories)){
            if (key == element['mov_catg_id'] && key <= 4){
              // checking if that movement already exist, if it's true, adding
              if (value in this.incomesMovCat){
                this.incomesMovCat[value] += parseInt(element['mov_value'])
                this.incomes += parseInt(element['mov_value'])
              } else {
                // setting incomes budget data
                this.incomesMovCat[value] = parseInt(element['mov_value'])
                this.incomes += parseInt(element['mov_value'])
              }
            } else if(key == element['mov_catg_id'] && key > 4) {
              // checking if that movement already exist, if it's true, adding
              if (value in this.expensesMovCat){
                this.expensesMovCat[value] += parseInt(element['mov_value'])
                this.expenses += parseInt(element['mov_value'])
              } else {
                // setting incomes budget data
                this.expensesMovCat[value] = parseInt(element['mov_value'])
                this.expenses += parseInt(element['mov_value'])
              }
            }
          }
        });
        
        // sorting budget and movements objetcs
        const categories = Object.values(this.allCategories);
        const budgets = [
          { obj: this.incomesBudgetCat, sorted: this.incomesBudgetCatSort },
          { obj: this.expensesBudgetCat, sorted: this.expensesBudgetCatSort },
          { obj: this.incomesMovCat, sorted: this.incomesMovCatSort },
          { obj: this.expensesMovCat, sorted: this.expensesMovCatSort }
        ];

        categories.forEach((key) => {
          budgets.forEach((budget) => {
            if (key in budget.obj) {
              budget.sorted[key] = budget.obj[key];
            }
          });
        });

        // setting data for bar chart
        this.chartData = {
          labels: Object.values(this.incomeCategories),
          datasets: [
            {
              label: 'Budget',
              backgroundColor: '#87CEFA',
              borderWidth: 1,
              borderColor: '#000',
              data: Object.values(this.incomeCategories).map(cat => this.incomesBudgetCatSort[cat] || 0)
            },
            {
              label: 'Execution',
              backgroundColor: '#000080',
              borderWidth: 1,
              borderColor: '#000',
              data: Object.values(this.incomeCategories).map(cat => this.incomesMovCatSort[cat] || 0)
            }
          ]
        };
        
      } catch(error){
        console.error(error);
      }
    },

    showChart(type) {
      let data = {
        labels: [],
        datasets: []
      };
      if (type === 'incomes') {
        data = {
          labels: Object.values(this.incomeCategories),
          datasets: [
            {
              label: 'Budget',
              backgroundColor: '#87CEFA',
              borderWidth: 1,
              borderColor: '#000',
              data: Object.values(this.incomeCategories).map(cat => this.incomesBudgetCatSort[cat] || 0)
            },
            {
              label: 'Execution',
              backgroundColor: '#000080',
              borderWidth: 1,
              borderColor: '#000',
              data: Object.values(this.incomeCategories).map(cat => this.incomesMovCatSort[cat] || 0)
            }
          ]
        };
      } else if (type === 'expenses') {
        //this.chartOptions['indexAxis'] = 'y';
        data = {
          labels: Object.values(this.expenseCategories),
          datasets: [
            {
              label: 'Budget',
              backgroundColor: '#FFECB3',
              borderWidth: 1,
              borderColor: '#000',
              data: Object.values(this.expenseCategories).map(cat => this.expensesBudgetCatSort[cat] || 0)
            },
            {
              label: 'Execution',
              backgroundColor: '#885407',
              borderWidth: 1,
              borderColor: '#000',
              data: Object.values(this.expenseCategories).map(cat => this.expensesMovCatSort[cat] || 0)
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
  background-color: #87ceeb;
  border: 1px solid #000;
  position: relative;
}

.budget-bar-exp {
  width: 60%;
  height: 30px;
  background-color: #ffebcd;
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
  background-color: #000080;
}

.expenses {
  background-color: #885407;
}

.chart-container {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 30px;
  height: 50vh;
  min-width: 300px; 
  max-width: 600px;
  margin: 0 auto; 
}

</style>