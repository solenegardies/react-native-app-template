export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface ILlmProvider {
  generateText(messages: LlmMessage[], options?: LlmOptions): Promise<string>;
  streamText(
    messages: LlmMessage[],
    options?: LlmOptions
  ): AsyncIterable<string>;
}
