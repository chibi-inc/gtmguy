import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { problem, targetMarket, mustHaveFunctionalities } = await readBody(event);

  const prompt = `As a Product Development expert , create a comprehensive MVP plan to validate ideas with least effort based on the following information:

Problem: ${problem}
Target Market: ${targetMarket}
Must-Have Functionalities: ${mustHaveFunctionalities}

Please provide a detailed MVP plan including:
1. Core Features Breakdown
2. Development Priorities
3. Technical Requirements
4. Success Criteria
5. Timeline Estimation
6. Resource Requirements
7. Risk Assessment
8. Launch Strategy

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