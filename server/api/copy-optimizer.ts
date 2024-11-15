import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { originalCopy, targetCustomer } = await readBody(event);

  const prompt = `As a Marketing Copy Expert, optimize this copy for the target customer:

Original Copy: ${originalCopy}
Target Customer: ${targetCustomer}

Please provide:
1. Optimized Copy
2. Key Changes Made
3. Psychological Triggers Used
4. Tone and Voice Analysis
5. Call-to-Action Recommendations

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Marketing Copy Expert specializing in customer-focused messaging.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to optimize copy'
    });
  }
}); 