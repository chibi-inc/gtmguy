import OpenAI from 'openai';
import { consumeCredit } from '../utils/consumeCredit';

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event);

  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { productDescription, userType } = await readBody(event);

  const prompt = `As a User Experience expert, create a detailed user journey map based on the following information:

Product Description: ${productDescription}
User Type: ${userType}

Please provide a comprehensive user journey analysis including:
1. User Stages
2. Actions at Each Stage
3. Thoughts and Feelings
4. Pain Points and Opportunities
5. Key Moments of Truth
6. Support Requirements
7. Improvement Recommendations

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a User Experience expert specializing in journey mapping.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate User Journey Map'
    });
  }
}); 