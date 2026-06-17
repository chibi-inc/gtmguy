import OpenAI from 'openai';
import { consumeCredit } from '../utils/consumeCredit';

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event);

  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { description, market } = await readBody(event);

  const prompt = `As a strategic business analyst, create a comprehensive SWOT analysis based on the following information:

Product Description: ${description}
Target Market: ${market}

Please provide a detailed SWOT analysis including:
1. Strengths (Internal positive factors)
2. Weaknesses (Internal negative factors)
3. Opportunities (External positive factors)
4. Threats (External negative factors)

For each category, provide:
- Detailed explanation of each point
- Impact assessment
- Potential action items

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a strategic business analyst specializing in SWOT analysis.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to generate SWOT Analysis'
    });
  }
}); 