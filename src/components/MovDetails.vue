<template>
    <div class="movements-view">
        <h3>Select year, month and type of movement:</h3>

        <!-- Combobox for Active Period -->
        <div class="current-period">
            <label class="label" for="year">Year:</label>
            <select class="selection" id="year" v-model="selectedYear">
                <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
            </select>

            <label class="label" for="month">Month:</label>
            <select class="selection" id="month" v-model="selectedMonth">
                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
            </select>

            <label class="label">Type:</label>
            <select class="selection" id="type" v-model="selectedType">
                <option v-for="type in mainCategory" :key="type" :value="type">{{ type }}</option>
            </select>

            <button class="button-show" @click="fetchMovements">Show</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Main Category</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="movement in filteredMovements" :key="movement.id">
                    <td>{{ movement.mov_date }}</td>
                    <td>{{ movement.mainCategory }}</td>
                    <td>{{ movement.category }}</td>
                    <td>{{ movement.mov_description }}</td>
                    <td>{{ movement.mov_value }}</td>
                    <td>
                        <button @click="editMovement(movement)">Edit</button>
                        <button @click="deleteMovement(movement.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
export default {
    data() {
        return {
            user_id_SS: '',
            movements: [],
            incomeMovements: [],
            expenseMovements: [],
            filteredMove: [],
            activePeriod: { period: '' },
            selectedPeriod: '',
            budgetPeriod: '',
            periodYear: [],
            periodMonths: [],
            numberMonth: '',
            uniqueYears: '',
            allBudgetPeriods: [],
            currentPeriod: '',
            selectedMonth: '',
            selectedYear: '',
            nameMonth: {
                '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June',
                '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December'
            },
            months: {
                1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
                7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
            },
            mainCategory: ['All', 'Incomes', 'Expenses'],
            selectedType: '',
            incomeCategories: { 1: 'Salary', 2: 'Rent', 3: 'Investment', 4: 'Other' },
            expenseCategories: {
                7: 'Rent', 8: 'Alimentation', 9: 'Health', 10: 'Services', 11: 'Transportation',
                12: 'Education', 13: 'Pets', 14: 'Entertainment', 15: 'Other', 16: 'Loan Payments'
            },
            allCategories: {
                1: 'Salary', 2: 'Rent', 3: 'Investment', 4: 'Other', 7: 'Rent', 8: 'Alimentation', 9: 'Health', 10: 'Services', 11: 'Transportation', 12: 'Education', 13: 'Pets', 14: 'Entertainment', 15: 'Other', 16: 'Loan Payments'
            },
        };
    },
    computed: {
        filteredMovements() {
            // filtering movements
            if (!this.selectedPeriod) {
                return this.movements;
            }
            return this.movements.filter(movement => {
                const movementDate = new Date(movement.date);
                return (
                    movementDate.getFullYear() === parseInt(year) &&
                    movementDate.getMonth() + 1 === parseInt(month)
                );
            });
        }
    },
    methods: {
        activePeriods() {
            // saving user_id:
            this.user_id_SS = sessionStorage.getItem('user_id')

            // saving active period 
            this.activePeriod['period'] = sessionStorage.getItem('activePeriod');
            return this.activePeriod
        },

        // getting the last active period in the database
        async getActivePeriod() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/budget/all_period_user/${this.user_id_SS}`)

                this.budgetPeriod = response.data;

                var allPeriods = []
                this.budgetPeriod.forEach(element => {
                    // save periods with format yyyy-MM
                    allPeriods.push(element['budget_period'])

                    // mapping name month:
                    this.periodYear.push(JSON.stringify(element['budget_period']).slice(1, 5))
                    this.numberMonth = JSON.stringify(element['budget_period']).slice(-3, -1)

                    for (const [key, value] of Object.entries(this.nameMonth)) {
                        if (key === this.numberMonth) {
                            this.periodMonths.push(value)
                            this.allBudgetPeriods.push(this.periodYear + ' - ' + value);
                        }
                    }
                })

                // converting array[] to set() to drop duplicates years
                this.uniqueYears = [...new Set(this.periodYear)];

                // getting budget movements
                this.currentPeriod = allPeriods[0]
            } catch (error) {
                console.error(error);
            }
        },
        async fetchMovements() {
            try {
                // cleaning arrays with movements
                this.incomeMovements = []
                this.expenseMovements = []

                // mapping month name for get month number
                var periodToSearch = ''
                for (const [key, value] of Object.entries(this.nameMonth)) {
                    if (value == this.selectedMonth) {
                        periodToSearch = this.selectedYear + '-' + key
                    }
                }

                const response = await axios.get(`http://127.0.0.1:8000/mov/mov_user_period/${this.user_id_SS}/${periodToSearch}`);
                this.movements = response.data;

                // categorize incomes and expenses in differents objects
                this.movements.forEach(element => {
                    for (const [key, value] of Object.entries(this.allCategories)) {
                        if (key == element['mov_catg_id'] && key <= 4) {
                            element['mainCategory'] = 'Incomes'
                            element['category'] = value
                            this.incomeMovements.push(element)
                        } else if (key == element['mov_catg_id'] && key > 4) {
                            element['mainCategory'] = 'Expenses'
                            element['category'] = value
                            this.expenseMovements.push(element)
                        }
                    }
                });

                //console.log(`incomes ${JSON.stringify(this.incomeMovements)}`)
                //console.log(`expenses ${JSON.stringify(this.expenseMovements)}`)
                console.log(`all movements ${JSON.stringify(this.movements)}`)

            } catch (error) {
                console.error('Error fetching movements:', error);
            }
        },
        editMovement(movement) {
            // Logic to edit the movement record
            console.log('Editing movement:', movement);
        },
        async deleteMovement(id) {
            try {
                await axios.delete(`http://127.0.0.1:8000/movements/${id}`);
                this.movements = this.movements.filter(movement => movement.id !== id);
            } catch (error) {
                console.error('Error deleting movement:', error);
            }
        }
    },
    mounted() {
        this.activePeriods();
        this.getActivePeriod();
    }
};
</script>

<style scoped>
.movements-view {
    padding: 20px;
}

.content {
    flex: 1;
    padding: 20px;
    text-align: center;
}

.current-period {
    padding: 5px;
    margin-bottom: 20px;
}

.label {
    margin-right: 5px;
}

.selection {
    margin-right: 10px;
}

.button-show {
    background-color: rgb(28, 221, 235);
}

.selectors {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
}

button {
    margin-right: 5px;
}
</style>
