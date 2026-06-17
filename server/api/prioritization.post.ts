import OpenAI from 'openai';
import { consumeCredit } from '../utils/consumeCredit';

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event);

  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { items, method, context } = await readBody(event);

  const methodPrompts = {
    RICE: "Use the RICE (Reach, Impact, Confidence, Effort) framework",
    MOSCOW: "Use the MoSCoW (Must have, Should have, Could have, Won't have) method",
    VALUE_EFFORT: "Use the Value vs Effort prioritization matrix",
    KANO: "Use the Kano model (Basic, Performance, Excitement features)"
  };

  const prompt = `As a Product Strategy Expert, prioritize these items using ${methodPrompts[method]}:

Items to Prioritize: ${items}
Additional context: ${context}

Please provide:
1. Prioritized List
2. Scoring/Reasoning for Each Item
3. Implementation Recommendations
4. Dependencies
5. Quick Wins
6. Long-term Considerations

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Product Strategy Expert specializing in prioritization frameworks.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate prioritization'
    });
  }
}); 