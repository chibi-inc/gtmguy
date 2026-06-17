import OpenAI from 'openai';
import { consumeCredit } from '../utils/consumeCredit';

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event);

  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { problem, mustHaveFunctionalities } = await readBody(event);

  const prompt = `As a Product Development expert, create both a low/no-code and a technical MVP plan to validate ideas based on the following information:

Problem: ${problem}
Must-Have Functionalities: ${mustHaveFunctionalities}

Please provide two detailed approaches:

A. Low/No-Code MVP Approach:
1. Recommended no-code/low-code tools
2. Implementation steps
3. Estimated timeline
4. Cost considerations
5. Limitations of this approach

B. Technical MVP Approach:
1. Core Features Breakdown
2. Development Priorities
3. Technical Requirements
4. Implementation Timeline
5. Success Criteria

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Product Development expert specializing in MVP planning.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate MVP Plan'
    });
  }
}); 
