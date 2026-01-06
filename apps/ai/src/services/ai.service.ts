import type { ILlmProvider, LlmMessage } from '../ports/llm-provider.port.js';
import type { IUserReader } from '../ports/user-reader.port.js';
import type { AiInput, AiOutput, ConversationMessage } from '../public/types.js';
import { buildSystemPrompt } from '../prompts/system.prompt.js';

interface AiServiceDependencies {
  llmProvider: ILlmProvider;
  userReader: IUserReader;
}

export class AiService {
  private llmProvider: ILlmProvider;
  private userReader: IUserReader;
  private conversations: Map<string, ConversationMessage[]> = new Map();

  constructor(deps: AiServiceDependencies) {
    this.llmProvider = deps.llmProvider;
    this.userReader = deps.userReader;
  }

  async chat(input: AiInput): Promise<AiOutput> {
    const conversationId = input.conversationId ?? this.generateConversationId();
    const userContext = await this.userReader.getUserContext(input.userId);

    const history = this.conversations.get(conversationId) ?? [];

    history.push({
      role: 'user',
      content: input.message,
      timestamp: new Date(),
    });

    const messages = this.buildMessages(userContext, history);
    const response = await this.llmProvider.generateText(messages);

    history.push({
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    });

    this.conversations.set(conversationId, history);

    return {
      response,
      conversationId,
    };
  }

  async *streamChat(
    input: AiInput
  ): AsyncGenerator<{ chunk: string; conversationId: string }> {
    const conversationId = input.conversationId ?? this.generateConversationId();
    const userContext = await this.userReader.getUserContext(input.userId);

    const history = this.conversations.get(conversationId) ?? [];

    history.push({
      role: 'user',
      content: input.message,
      timestamp: new Date(),
    });

    const messages = this.buildMessages(userContext, history);
    let fullResponse = '';

    for await (const chunk of this.llmProvider.streamText(messages)) {
      fullResponse += chunk;
      yield { chunk, conversationId };
    }

    history.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
    });

    this.conversations.set(conversationId, history);
  }

  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  private buildMessages(
    userContext: Awaited<ReturnType<IUserReader['getUserContext']>>,
    history: ConversationMessage[]
  ): LlmMessage[] {
    const systemPrompt = buildSystemPrompt(userContext);

    const messages: LlmMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    return messages;
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}
