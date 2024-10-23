<template>
    <div class="budget-view">
        <!-- Title -->
      <div class="title">
        <h3>Select year and month of your Budget</h3>
      </div>
        <!-- Combobox for Year and Month -->
      <div class="selectors">
        <label for="year">Year:</label>
        <select id="year" v-model="selectedYear">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>

        <label for="month">Month:</label>
        <select id="month" v-model="selectedMonth">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>
  
      <!-- Expansion Panels -->
      <div class="expansion-panel">
        <div @click="togglePanel('incomes')" class="panel-header">Incomes</div>
        <div v-if="expandedPanel === 'incomes'" class="panel-content">
            <div v-for="income in incomes" :key="income.id" class="record">
            <span>{{ income.category }}: ${{ income.value }}</span>
          </div>
            <button @click="showIncomeForm = !showIncomeForm">Add New Income</button>
          <div v-if="showIncomeForm" class="form">
            <select v-model="newIncome.category">
              <option v-for="category in incomeCategories" :key="category" :value="category">{{ category }}</option>
            </select>
            <input type="text" v-model="newIncome.value" placeholder="Value" />
            <input type="text" v-model="newIncome.description" placeholder="Description" />
            <button @click="saveIncome">Save</button>
          </div>
        </div>
      </div>
  
      <div class="expansion-panel">
        <div @click="togglePanel('expenses')" class="panel-header">Expenses</div>
        <div v-if="expandedPanel === 'expenses'" class="panel-content">
          <button @click="showExpenseForm = !showExpenseForm">Add New Expense</button>
          <div v-if="showExpenseForm" class="form">
            <select v-model="newExpense.category">
              <option v-for="category in expenseCategories" :key="category" :value="category">{{ category }}</option>
            </select>
            <input type="text" v-model="newExpense.value" placeholder="Value" />
            <input type="text" v-model="newExpense.description" placeholder="Description" />
            <button @click="saveExpense">Save</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  export default {
    name: 'BudgetView',
    data() {
      return {
        years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().toLocaleString('default', { month: 'long' }),
        expandedPanel: null,
        showIncomeForm: false,
        showExpenseForm: false,
        incomeCategories: ['Salary', 'Rent', 'Investment', 'Other'],
        expenseCategories: ['Rent', 'Alimentation', 'Health', 'Services', 'Transportation', 'Education', 'Pets', 'Entertainment', 'Other', 'Loan Payments'],
        newIncome: {
          category: '',
          value: '',
          description: ''
        },
        newExpense: {
          category: '',
          value: '',
          description: ''
        },
        incomes:[],
        expenses: []
      };
    },
    methods: {
      togglePanel(panel) {
        this.expandedPanel = this.expandedPanel === panel ? null : panel;
      },
      saveIncome() {
        // Logic to save the income budget
        console.log('Saving income:', this.newIncome);
        this.resetForm('income');
        this.showIncomeForm = false;
      },
      saveExpense() {
        // Logic to save the expense budget
        console.log('Saving expense:', this.newExpense);
        this.resetForm('expense');
        this.showExpenseForm = false;
      },
      resetForm(type) {
        if (type === 'income') {
          this.newIncome = { category: '', value: '', description: '' };
        } else {
          this.newExpense = { category: '', value: '', description: '' };
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .budget-view {
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
    margin-bottom: 20px;
    
  }
  
  .selectors select {
    padding: 5px;
    font-size: 16px;
  }
  
  .expansion-panel {
    margin-bottom: 20px;
    border: 1px solid rgb(28, 221, 235);
    border-radius: 5px;
    overflow: hidden;
  }
  
  .panel-header {
    padding: 10px;
    color: rgb(255, 255, 255);
    background-color: rgb(15, 9, 68);
    cursor: pointer;
  }
  
  .panel-content {
    padding: 10px;
    background-color: rgb(165, 177, 218);;
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
    color: #030303;
    border: none;
    cursor: pointer;
  }
  </style>
  