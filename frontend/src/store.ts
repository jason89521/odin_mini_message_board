import { reactive } from 'vue';
import { Message } from './type';

type MessageSource = 'new' | 'list';

export const messageStore = reactive({
  messages: [] as Message[],
  source: 'list' as MessageSource,
  newMessage(message: Message) {
    this.messages.push(message);
    this.source = 'new';
  },
  prependMessages(messages: Message[]) {
    this.messages = [...messages, ...this.messages];
    this.source = 'list';
  },
});
