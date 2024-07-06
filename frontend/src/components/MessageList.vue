<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import MessageItem from './MessageItem.vue';
import { ListMessageResponse } from '../type';
import { messageStore } from '../store';

defineProps<{ name: string }>();

const URL_PREFIX = 'http://localhost:5566/message';
const container = ref<HTMLUListElement | null>(null);
const observerTarget = ref<HTMLLIElement | null>(null);
const next = ref<string | null>(null);
const noMore = ref(false);
const isLoading = ref(false);

function loadMore() {
  const ul = container.value;
  if (noMore.value || isLoading.value || !ul) {
    return;
  }
  isLoading.value = true;
  const url = `${URL_PREFIX}/list${next.value ? `?before=${next.value}` : ''}`;
  fetch(url)
    .then(res => res.json())
    .then(async (data: ListMessageResponse) => {
      messageStore.prependMessages(data.items);
      if (data.next === null) {
        noMore.value = true;
      }
      next.value = data.next;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

watch(messageStore, async (newStore, oldStore) => {
  const ul = container.value;
  if (!ul) return;
  if (oldStore.messages.length === 0 || newStore.source === 'new') {
    await nextTick();
    ul.scrollBy({ top: Number.MAX_SAFE_INTEGER });

    return;
  }

  const oldScrollHeight = ul.scrollHeight;
  const oldScrollTop = ul.scrollTop;
  await nextTick();
  const newScrollHeight = ul.scrollHeight;
  ul.scrollTo({ top: newScrollHeight - oldScrollHeight + oldScrollTop });
});

watch(observerTarget, target => {
  if (!target) {
    return;
  }
  const observer = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      loadMore();
    }
  });
  observer.observe(target);
});
</script>

<template>
  <ul ref="container">
    <li ref="observerTarget" class="observer"></li>
    <MessageItem
      v-for="message in messageStore.messages"
      :key="message.id"
      :author="message.author"
      :content="message.content"
      :createdAt="message.createdAt"
      :is-self="message.author === name"
    >
      {{ message.author }}, {{ message.content }}, {{ message.createdAt }}
    </MessageItem>
  </ul>
</template>

<style scoped>
ul {
  padding: 5px 10px;
  margin: 0;
  height: 600px;
  overflow: auto;
  border: 1px solid wheat;
}

.observer {
  width: 0;
  height: 0;
}
</style>
