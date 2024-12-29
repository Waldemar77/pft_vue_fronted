<template>
  <div v-if="visible" class="popupS">
    <div class="popupS-content">
      <span class="close" @click="closePopup">&times;</span>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    statusType: {
      type: String,
      required: false
    },
    routeToMove: {
      type: String,
      required: false
    }
  },
  methods: {
    closePopup() {
      if (this.statusType == 'success') {
        this.$emit('close');
        this.$router.push({ name: this.routeToMove });
      }
    }
  }
};
</script>

<style>
.popupS {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(186, 243, 196, 0.806);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popupS-content {
  background-color: rgb(231, 228, 228);
  padding: 20px;
  border-radius: 5px;
  position: relative;
  color: black;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>