export interface AiInput {
  userId: string;
  message: string;
  conversationId?: string;
}

export interface AiOutput {
  response: string;
  conversationId: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
