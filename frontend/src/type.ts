export interface Message {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ListMessageResponse {
  items: Message[];
  next: string | null;
}
