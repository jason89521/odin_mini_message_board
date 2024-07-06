<script setup lang="ts">
defineProps<{ isSelf: boolean; author: string; content: string; createdAt: string }>();
</script>

<template>
  <li :class="{ right: isSelf }">
    <span>{{ author }}</span>
    <p>{{ content }}</p>
    <span>{{ new Date(createdAt).toLocaleString() }}</span>
  </li>
</template>

<style scoped>
.right {
  align-items: flex-end;
}

li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

li:not(:last-child) {
  margin-bottom: 20px;
}

span {
  display: block;
}

p {
  margin: 0;
  max-width: 85%;
  border-radius: 10px;
  padding: 8px 16px;
  border: 1px solid white;
  text-align: left;
}
</style>
