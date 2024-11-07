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

    <!-- Incomes Panel -->
    <div class="expansion-panel">
      <div class="panel-header" @click="togglePanel('incomes')">
        <h4>Incomes</h4>
      </div>
      <div class="panel-content" v-show="panels.incomes">
        <div v-for="(sum, category) in incomeSums" :key="category" class="category-panel">
          <div class="panel-header" @click="toggleCategory(category)">
            <h4>{{ category }}: {{ sum }}</h4>
          </div>
          <div class="panel-content" v-show="categoryStates[category]">
            <div v-for="(budget, index) in incomes.filter(b => b.category === category)" :key="index">
              <p>{{ budget.description }}: {{ budget.value }}</p>
            </div>
          </div>
        </div>
        <!-- Button to Add New Budget -->
        <button @click="showIncomeForm = !showIncomeForm">Add New Budget</button>
        <div v-if="showIncomeForm" class="form">
          <select v-model="newIncome.category">
            <option v-for="category in incomeCategories" :key="category" :value="category">{{ category }}</option>
          </select>
          <input type="number" v-model="newIncome.value" placeholder="Value" />
          <input type="text" v-model="newIncome.description" placeholder="Description" />
          <button @click="addIncome">Save</button>
        </div>
      </div>
    </div>

    <!-- Expenses Panel -->
    <div class="expansion-panel">
      <div class="panel-header" @click="togglePanel('expenses')">
        <h4>Expenses</h4>
      </div>
      <div class="panel-content" v-show="panels.expenses">
        <div v-for="(sum, category) in expenseSums" :key="category" class="category-panel">
          <div class="panel-header" @click="toggleCategory(category)">
            <h4>{{ category }}: {{ sum }}</h4>
          </div>
          <div class="panel-content" v-show="categoryStates[category]">
            <div v-for="(budget, index) in expenses.filter(b => b.category === category)" :key="index">
              <p>{{ budget.description }}: {{ budget.value }}</p>
            </div>
          </div>
        </div>
        <!-- Button to Add New Expense -->
        <button @click="showExpenseForm = !showExpenseForm">Add New Expense</button>
        <div v-if="showExpenseForm" class="form">
          <select v-model="newExpense.category">
            <option v-for="category in expenseCategories" :key="category" :value="category">{{ category }}</option>
          </select>
          <input type="number" v-model="newExpense.value" placeholder="Value" />
          <input type="text" v-model="newExpense.description" placeholder="Description" />
          <button @click="addExpense">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetView',
  data() {
    return {
      years: [2025, 2026, 2027, 2028, 2029, 2030],
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().toLocaleString('default', { month: 'long' }),
      panels: {
        incomes: false,
        expenses: false
      },
      showIncomeForm: false,
      showExpenseForm: false,
      incomeCategories: ['Salary', 'Rent', 'Investment', 'Other'],
      expenseCategories: [
        'Rent', 'Alimentation', 'Health', 'Services', 'Transportation',
        'Education', 'Pets', 'Entertainment', 'Other', 'Loan Payments'
      ],
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
      incomes: [],
      expenses: [],
      categoryStates: {}
    };
  },
  computed: {
    incomeSums() {
      return this.calculateSums(this.incomes);
    },
    expenseSums() {
      return this.calculateSums(this.expenses);
    }
  },
  methods: {
    togglePanel(panel) {
      this.panels[panel] = !this.panels[panel];
    },
    toggleCategory(category) {
      this.categoryStates[category] = !this.categoryStates[category];
    },
    addIncome() {
      if (this.newIncome.category && this.newIncome.value) {
        this.incomes.push({
          category: this.newIncome.category,
          value: this.newIncome.value,
          description: this.newIncome.description
        });
        this.newIncome = { category: '', value: '', description: '' };
      } else {
        alert('Please fill in all fields.');
      }
      this.showIncomeForm = false;
    },
    addExpense() {
      if (this.newExpense.category && this.newExpense.value) {
        this.expenses.push({
          category: this.newExpense.category,
          value: this.newExpense.value,
          description: this.newExpense.description
        });
        this.newExpense = { category: '', value: '', description: '' };
      } else {
        alert('Please fill in all fields.');
      }
      this.showExpenseForm = false;
    },
    calculateSums(budgets) {
      return budgets.reduce((sums, budget) => {
        sums[budget.category] = (sums[budget.category] || 0) + parseInt(budget.value);
        return sums;
      }, {});
    }
  }
};
</script>

<style scoped>
/* Your existing styles */
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
  padding: 5px;
  color: rgb(255, 255, 255);
  background-color: rgb(15, 9, 68);
  cursor: pointer;
}

.category-panel {
  margin-bottom: 10px;
}

.panel-content {
  padding: 10px;
  background-color: rgb(165, 177, 218);
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
