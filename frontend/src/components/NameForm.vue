<script setup lang="ts">
import { ref } from 'vue';

const name = ref('');

const emit = defineEmits<{ submitName: [name: string] }>();
</script>

<template>
  <form @submit.prevent="emit('submitName', name)">
    <label for="author">Name</label>
    <input v-model="name" type="text" id="author" name="author" />
    <button type="submit">Submit</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
}

label {
  display: block;
  font-size: 18px;
  font-weight: 600;
}

input {
  display: block;
  height: 36px;
  width: 100%;
  padding: 4px 8px;
}

button {
  display: block;
}
</style>
