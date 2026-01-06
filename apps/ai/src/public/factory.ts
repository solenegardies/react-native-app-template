import { AiService } from '../services/ai.service.js';
import type { ILlmProvider } from '../ports/llm-provider.port.js';
import type { IUserReader } from '../ports/user-reader.port.js';

export interface AiServiceDependencies {
  llmProvider: ILlmProvider;
  userReader: IUserReader;
}

export function createAiService(deps: AiServiceDependencies): AiService {
  return new AiService(deps);
}
