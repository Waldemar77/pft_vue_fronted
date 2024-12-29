<template>
    <div class="movements-view">
        <h2>Movements Detail</h2>

        <!-- Combobox for Active Period -->
        <div class="selectors">
            <label>Active Period:</label>
            <select id="period" v-model="selectedPeriod">
                <option v-for="period in activePeriods" :key="period" :value="period">{{ period }}</option>
            </select>
            <label>Type:</label>
            <select id="type" v-model="selectedType">
                <option v-for="type in mainCategory" :key="type" :value="type">{{ type }}</option>
            </select>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="movement in filteredMovements" :key="movement.id">
                    <td>{{ movement.mov_date }}</td>
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
export default {
    data() {
        return {
            user_id_SS: '',
            movements: [],
            incomeMovements: [],
            expenseMovements: [],
            activePeriod: { period: '' },
            selectedPeriod: '',
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
        async fetchMovements() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/mov/mov_user_period/${this.user_id_SS}/${this.selectedPeriod}`);
                this.movements = response.data;

                // categorize incomes and expenses in differents objects
                this.movements.forEach(element => {
                    for (const [key, value] of Object.entries(this.allCategories)) {
                        if (key == element['mov_catg_id'] && key <= 4) {
                            this.incomeMovements.push(element)
                            this.incomeMovements['category'] = value
                        } else {
                            this.expenseMovements.push(element)
                            this.expenseMovements['category'] = value
                        }
                    }
                });

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
        this.fetchMovements();
    }
};
</script>

<style scoped>
.movements-view {
    padding: 20px;
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
