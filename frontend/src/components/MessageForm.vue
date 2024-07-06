<script setup lang="ts">
import { computed, ref } from 'vue';
import { Message } from '../type';
import { messageStore } from '../store';

const { author } = defineProps<{ author: string }>();

const content = ref('');
const isSubmitting = ref(false);
const disabled = computed(() => {
  return isSubmitting.value || content.value.trim() === '';
});

function handleSubmit() {
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;
  fetch('http://localhost:5566/message/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ author, content: content.value.trim() }),
  })
    .then(res => res.json())
    .then((data: Message) => {
      content.value = '';
      messageStore.newMessage(data);
    })
    .finally(() => {
      isSubmitting.value = false;
    });
}

function handleKeyDown(event: KeyboardEvent) {
  console.log(event.key);
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    handleSubmit();
    return;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <textarea
      aria-label="message"
      name="message"
      v-model="content"
      placeholder="Type your message."
      @keydown="handleKeyDown"
    ></textarea>
    <button type="submit" :disabled="disabled">Send</button>
  </form>
</template>

<style>
form {
  width: 100%;
  display: flex;
  margin-top: 20px;
  gap: 20px;
}

textarea {
  flex: 1;
  resize: none;
  min-height: 100px;
  font-size: 16px;
  padding: 8px;
}
</style>
