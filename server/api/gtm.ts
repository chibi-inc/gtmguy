import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { productDescription, marketContext } = await readBody(event);

  const prompt = `As a Go-to-Market strategy expert, create a comprehensive GTM strategy based on the following information:

Product Description: ${productDescription}
Market Context: ${marketContext}

Please provide a detailed GTM strategy including:
1. Market Entry Strategy
2. Positioning and Messaging
3. Channel Strategy
4. Sales Strategy
5. Marketing Strategy
6. Customer Acquisition Plan
7. Growth Roadmap
8. Success Metrics

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Go-to-Market strategy expert specializing in GTM planning.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to generate GTM Strategy'
    });
  }
}); 