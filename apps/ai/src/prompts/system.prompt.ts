import type { UserContext } from '../ports/user-reader.port.js';

export function buildSystemPrompt(userContext?: UserContext | null): string {
  const userName = userContext?.displayName ?? 'User';

  return `You are a helpful AI assistant. You provide clear, concise, and accurate responses.

${userContext ? `You are chatting with ${userName}.` : ''}

Guidelines:
- Be helpful and friendly
- Provide accurate information
- If you're unsure about something, say so
- Keep responses concise but thorough
- Use markdown formatting when appropriate`;
}

export const DEFAULT_SYSTEM_PROMPT = buildSystemPrompt();
