<template>
    <div class="bottom-nav">
      <div 
        v-for="item in items" 
        :key="item.name" 
        :class="['nav-item', { active: item.name === activeItem }]" 
        @click="selectItem(item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BottomNavigation',
    data() {
      return {
        items: [
          { name: 'Budget', route: 'BudgetNew'},
          { name: 'Movements', route: 'Home'},
          { name: 'Outcomes', route: 'Home'}
        ],
        activeItem: 'Nearby'
      };
    },
    methods: {
      selectItem(item) {
        this.activeItem = item.name;
        this.$emit('update', item.name);
        if (item.route) {
          this.$router.push({ name: item.route});
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    background-color: rgb(15, 9, 68);
    border-top: 1px solid rgb(28, 221, 235);
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    padding: 10px 0;
    cursor: pointer;
  }
  
  .nav-item i {
    display: block;
    font-size: 20px;
  }
  
  .nav-item span {
    display: block;
    margin-top: 5px;
  }
  
  .nav-item.active {
    background-color: rgb(28, 221, 235);
    color: black;
    border-radius: 5px;
  }
  </style>
  