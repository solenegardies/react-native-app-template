import { z } from 'zod';

export const chatInputSchema = z.object({
  userId: z.string(),
  message: z.string(),
  conversationId: z.string().optional(),
});

export const chatOutputSchema = z.object({
  response: z.string(),
  conversationId: z.string(),
});

export type ChatInput = z.infer<typeof chatInputSchema>;
export type ChatOutput = z.infer<typeof chatOutputSchema>;

export const chatWorkflow = {
  name: 'chat',
  description: 'Handle chat messages and generate AI responses',
  inputSchema: chatInputSchema,
  outputSchema: chatOutputSchema,
};
