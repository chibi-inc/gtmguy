import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { product, keyFeatures } = await readBody(event);

  const prompt = `As a Product Launch Expert, create a comprehensive launch plan for:

Product: ${product}
Key Features: ${keyFeatures}

Please provide:
1. Pre-launch Strategy
2. Launch Day Plan
3. Marketing Channels
4. Content Strategy
5. PR Strategy
6. Success Metrics
7. Timeline
8. Risk Mitigation
9. Post-launch Activities

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Product Launch Expert specializing in go-to-market strategy.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate launch plan'
    });
  }
}); 