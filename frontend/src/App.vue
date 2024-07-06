<script setup lang="ts">
import { ref } from 'vue';
import NameForm from './components/NameForm.vue';
import MessageList from './components/MessageList.vue';
import MessageForm from './components/MessageForm.vue';

const name = ref('');
</script>

<template>
  <div>
    <template v-if="name">
      <MessageList :name="name" />
      <MessageForm :author="name" />
    </template>
    <NameForm v-else @submit-name="value => (name = value)" />
  </div>
</template>

<style scoped>
div {
  min-width: 300px;
  width: 1080px;
}
</style>
