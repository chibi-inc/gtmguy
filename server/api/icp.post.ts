import OpenAI from 'openai';
import { consumeCredit } from '../utils/consumeCredit';

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event);

  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { productDescription, targetMarket } = await readBody(event);

  const prompt = `As a Go-to-Market expert, create a detailed Ideal Customer Profile (ICP) based on the following information:

Product Description: ${productDescription}
Target Market: ${targetMarket}

Please provide a comprehensive ICP analysis including:
1. Demographics (company size, industry, revenue)
2. Firmographics (business model, tech stack, growth stage)
3. Pain Points and Challenges
4. Goals and Objectives
5. Decision Making Process
6. Budget and Resources
7. Key Success Indicators

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Go-to-Market strategy expert specializing in ICP development.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate ICP'
    });
  }
});