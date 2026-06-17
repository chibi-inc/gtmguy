import OpenAI from 'openai';
import { consumeCredit } from '../utils/consumeCredit';

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event);

  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { objectives, targetUsers } = await readBody(event);

  const prompt = `As a User Research Expert, create a comprehensive research plan for:

Research Objectives: ${objectives}
Target Users: ${targetUsers}

Please provide:
1. Research Objectives
2. Research Methods
3. Participant Criteria
4. Interview Questions
5. Survey Design
6. Timeline
7. Success Metrics
8. Budget Considerations

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a User Research Expert specializing in product research.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate research plan'
    });
  }
}); 