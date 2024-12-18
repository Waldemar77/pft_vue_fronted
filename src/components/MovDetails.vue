<template>
    <div class="movements-view">
      <h2>Movements Detail</h2>
      
      <div class="filter-section">
        <label for="period">Select Period:</label>
        <input type="month" id="period" v-model="selectedPeriod" @change="fetchMovements" />
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
            <td>{{ movement.date }}</td>
            <td>{{ movement.category }}</td>
            <td>{{ movement.description }}</td>
            <td>{{ movement.amount }}</td>
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
  export default {
    data() {
      return {
        movements: [],
        selectedPeriod: ''
      };
    },
    computed: {
      filteredMovements() {
        if (!this.selectedPeriod) {
          return this.movements;
        }
        const [year, month] = this.selectedPeriod.split('-');
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
      async fetchMovements() {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/movements/user/${this.selectedPeriod}`);
          this.movements = response.data;
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
      this.fetchMovements();
    }
  };
  </script>
  
  <style scoped>
  .movements-view {
    padding: 20px;
  }
  
  .filter-section {
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
  }
  
  button {
    margin-right: 5px;
  }
  </style>
  