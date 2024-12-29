<template>
  <div class="mov-view">
    <!-- Title -->
    <div class="title">
      <h3>Select a current active period:</h3>
    </div>
    <!-- Combobox for Active Period -->
    <div class="selectors">
      <label for="period">Active Period:</label>
      <select id="period" v-model="selectedPeriod">
        <option v-for="period in activePeriods" :key="period" :value="period">{{ period }}</option>
      </select>
    </div>

    <!-- Incomes Panel -->
    <div class="expansion-panel">
      <div class="panel-header" @click="togglePanel('incomes')">
        <h4 class="h4-title">Incomes (Total: {{ totalIncomes }})</h4>
      </div>
      <div class="panel-content" v-show="panels.incomes">
        <div v-for="(sum, category) in incomeSums" :key="category" class="category-panel">
          <div class="panel-header2" @click="toggleCategory(category)">
            <h5 class="h5-title">{{ category }}: {{ sum }}</h5>
          </div>
          <div class="panel-content" v-show="categoryStates[category]">
            <div v-for="(mov, index) in incomes.filter(b => b.category === category)" :key="index">
              <p>{{ mov.description }}: {{ mov.value }}</p>
            </div>
          </div>
        </div>
        <!-- Button to Add New movement -->
        <button @click="showIncomeForm = !showIncomeForm">Add New Income</button>
        <div v-if="showIncomeForm" class="form">
          <select v-model="newIncome.category">
            <option v-for="category in incomeCategories" :key="category" :value="category">{{ category }}</option>
          </select>
          <input type="date" v-model="newIncome.date" placeholder="Movement Date">
          <input type="number" v-model="newIncome.value" placeholder="Value" />
          <input type="text" v-model="newIncome.description" placeholder="Description" />
          <button @click="addIncome">Save</button>
        </div>
      </div>
    </div>

    <!-- Expenses Panel -->
    <div class="expansion-panel">
      <div class="panel-header" @click="togglePanel('expenses')">
        <h4>Expenses (Total: {{ totalExpenses }})</h4>
      </div>
      <div class="panel-content" v-show="panels.expenses">
        <div v-for="(sum, category) in expenseSums" :key="category" class="category-panel">
          <div class="panel-header2" @click="toggleCategory(category)">
            <h5 class="h5-title">{{ category }}: {{ sum }}</h5>
          </div>
          <div class="panel-content" v-show="categoryStates[category]">
            <div v-for="(mov, index) in expenses.filter(b => b.category === category)" :key="index">
              <p>{{ mov.description }}: {{ mov.value }}</p>
            </div>
          </div>
        </div>
        <!-- Button to Add New Expense -->
        <button @click="showExpenseForm = !showExpenseForm">Add New Expense</button>
        <div v-if="showExpenseForm" class="form">
          <select v-model="newExpense.category">
            <option v-for="category in expenseCategories" :key="category" :value="category">{{ category }}</option>
          </select>
          <input type="date" v-model="newExpense.date" placeholder="Movement Date">
          <input type="number" v-model="newExpense.value" placeholder="Value" />
          <input type="text" v-model="newExpense.description" placeholder="Description" />
          <button @click="addExpense">Save</button>
        </div>
      </div>
    </div>
    <div>
      <button @click="saveMov"> Save Record </button>
    </div>
    <ErrorPopUp v-if="showPopup" :visible="showPopup" :message="errorMessage" @close="showPopup = false" />
    <SuccessPopUp v-if="showPopupS" :visible="showPopupS" :message="successMessage" :statusType="popupType"
      :routeToMove="routeMove" @close="showPopupS = false" />
  </div>
</template>

<script>
import axios from 'axios';
import ErrorPopUp from './ErrorPopUp.vue';
import SuccessPopUp from './SuccessPopUp.vue';

/* eslint-disable */
export default {
  name: 'MovementNew',
  data() {
    return {
      activePeriod: { period: '' },
      selectedPeriod: '',
      months: {
        1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
        7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
      },
      panels: {
        incomes: false,
        expenses: false
      },
      showIncomeForm: false,
      showExpenseForm: false,
      incomeCategories: { 1: 'Salary', 2: 'Rent', 3: 'Investment', 4: 'Other' },
      expenseCategories: {
        7: 'Rent', 8: 'Alimentation', 9: 'Health', 10: 'Services', 11: 'Transportation',
        12: 'Education', 13: 'Pets', 14: 'Entertainment', 15: 'Other', 16: 'Loan Payments'
      },
      newIncome: {
        category: '',
        date: '',
        value: '',
        description: ''
      },
      newExpense: {
        category: '',
        date: '',
        value: '',
        description: ''
      },
      incomes: [],
      expenses: [],
      categoryStates: {},
      user_id_SS: '',
      month_mov: '',
      period_mov: '',
      json_to_save: [],
      json_response: '',

      showPopup: false,
      popupType: '',
      errorMessage: '',
      showPopupS: false,
      successMessage: '',
      routeMove: ''
    };
  },
  components: {
    ErrorPopUp,
    SuccessPopUp
  },
  computed: {
    incomeSums() {
      return this.calculateSums(this.incomes);
    },
    expenseSums() {
      return this.calculateSums(this.expenses);
    },
    totalIncomes() {
      return this.calculateTotal(this.incomes);
    },
    totalExpenses() {
      return this.calculateTotal(this.expenses);
    },
    activePeriods() {
      this.activePeriod['period'] = sessionStorage.getItem('activePeriod');
      return this.activePeriod
    }
  },
  methods: {
    togglePanel(panel) {
      this.panels[panel] = !this.panels[panel];
      this.$emit('panel-toggle', { panel, expanded: this.panels[panel] });
    },
    toggleCategory(category) {
      this.categoryStates[category] = !this.categoryStates[category];
    },
    addIncome() {
      if (this.newIncome.category && this.newIncome.value) {
        this.incomes.push({
          category: this.newIncome.category,
          date: this.newIncome.date,
          value: this.newIncome.value,
          description: this.newIncome.description
        });
        this.newIncome = { category: '', date: '', value: '', description: '' };
      } else {
        alert('Please fill in all fields.');
      }
      this.showIncomeForm = false;
    },
    addExpense() {
      if (this.newExpense.category && this.newExpense.value) {
        this.expenses.push({
          category: this.newExpense.category,
          date: this.newExpense.date,
          value: this.newExpense.value,
          description: this.newExpense.description
        });
        this.newExpense = { category: '', date: '', value: '', description: '' };
      } else {
        alert('Please fill in all fields.');
      }
      this.showExpenseForm = false;
    },
    calculateSums(movs) {
      return movs.reduce((sums, mov) => {
        sums[mov.category] = (sums[mov.category] || 0) + parseInt(mov.value);
        return sums;
      }, {});
    },
    calculateTotal(movs) {
      return movs.reduce((total, mov) => total + parseInt(mov.value), 0);
    },
    async saveMov() {
      // when user saves and the panel is extended, we close both panels to show buttomBar
      this.panels['incomes'] = true
      this.panels['expenses'] = true
      this.togglePanel('incomes');
      this.togglePanel('expenses');

      // getting year and month from period selected
      try {
        var yearP = this.selectedPeriod.split('-')[0].replaceAll(' ', '');
        var monthP = this.selectedPeriod.split('-')[1].replaceAll(' ', '');
      } catch (error) {
        this.errorMessage = 'You need to select an active period first. Please try again.';
        this.popupType = 'error';
        this.showPopup = true;
        console.error(error);
        return;
      }

      // setting period (yyyy-MM)
      for (const [key, value] of Object.entries(this.months)) {
        if (value === monthP) {
          if (key >= 10) {
            this.month_mov = key;
          } else {
            this.month_mov = '0' + key;
          }
        }
      }
      this.period_mov = yearP + "-" + this.month_mov

      // saving user_id:
      this.user_id_SS = sessionStorage.getItem('user_id')

      // identity category id for incomes and creating JSON
      this.incomes.map(record => {
        for (const [key, value] of Object.entries(this.incomeCategories)) {
          if (value === record.category) {
            this.json_to_save.push({
              user_id: this.user_id_SS,
              mov_catg_id: key,
              mov_period: this.period_mov,
              mov_value: record.value,
              mov_date: record.date,
              mov_description: record.description,
              period_is_open: 'Y',
              record_date: ''
            })
          }
        }
      })

      // identify category id for expenses and creating JSON
      this.expenses.map(record => {
        for (const [key, value] of Object.entries(this.expenseCategories)) {
          if (value === record.category) {
            this.json_to_save.push({
              user_id: this.user_id_SS,
              mov_catg_id: key,
              mov_period: this.period_mov,
              mov_value: record.value,
              mov_date: record.date,
              mov_description: record.description,
              period_is_open: 'Y',
              record_date: ''
            })
          }
        }
      })

      // saving record in database
      try {
        const response = await axios.post('http://127.0.0.1:8000/mov/saving_mov/', this.json_to_save)

        // getting response confirmation
        //console.log(JSON.stringify(response.data))
        // Handle successful sign-up, e.g., save token, redirect, etc.
        if (response.data.slice(0, 3) == '[1]') {
          this.successMessage = `Your movement for period ${this.period_mov} has been saved successfully`;
          this.popupType = 'success';
          this.routeMove = 'Home';
          this.showPopupS = true;
        } else if (response.data.slice(0, 3) == '[0]') {
          this.errorMessage = `:( Something wrong happened, we could not save your movement for period ${this.period_mov}. Try later.`;
          this.popupType = 'error';
          this.showPopup = true;
        }
        console.log(response.data);
      } catch (error) {
        this.errorMessage = 'Failed to create your movement. Please try again.';
        this.popupType = 'error';
        this.showPopup = true;
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.mov-view {
  padding: 20px;
}

.title {
  color: white;
  text-align: center;
  text-size-adjust: 16;
}

.selectors {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.selectors select {
  padding: 5px;
  font-size: 16px;
}

.h5-title {
  height: auto;
  padding: 5px;
  margin: 5px;
  margin-bottom: 10px;
}

.h4-title {
  height: auto;
}

.expansion-panel {
  margin-bottom: 20px;
  border: 1px solid rgb(28, 221, 235);
  border-radius: 5px;
  overflow: hidden;
}

.panel-header {
  padding-left: 20px;
  padding-top: 1px;
  padding-bottom: 1px;
  height: auto;
  color: white;
  background-color: rgb(15, 9, 68);
  cursor: pointer;
  text-align: left;
}

.panel-header2 {
  padding-left: 20px;
  height: auto;
  color: black;
  background-color: rgb(156, 245, 163);
  cursor: pointer;
}

.category-panel {
  margin-bottom: 5px;
}

.panel-content {
  padding-top: 5px;
  padding-left: 10px;
  padding-bottom: 5px;
  padding-right: 5px;
  height: fit-content;
  background-color: rgb(165, 177, 218);
  color: black;
}

.form {
  margin-top: 10px;
}

.form select,
.form input {
  display: block;
  width: 90%;
  margin-bottom: 10px;
  padding: 5px;
  font-size: 16px;
}

.form button {
  padding: 5px 10px;
  background-color: #95ff3e;
  color: black;
  border: none;
  cursor: pointer;
}
</style>