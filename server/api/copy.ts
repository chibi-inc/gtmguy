import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { productDetails, targetCustomer } = await readBody(event);

  const prompt = `As a Marketing Copy Expert, generate 5 different marketing copy versions for this product and target customer:

Product Details: ${productDetails}
Target Customer: ${targetCustomer}

Rules:
1. Each version should be concise and impactful (2-3 sentences)
2. Focus on making the language appealing to the target customer
3. Each version should have a distinct approach:
   - Version 1: Focus on benefits and value proposition
   - Version 2: Emphasize emotional connection
   - Version 3: Highlight social proof and credibility
   - Version 4: Use problem-solution framework
   - Version 5: Focus on urgency and FOMO

Please provide:
1. Five Copy Versions (numbered 1-5)
2. Key Features Highlighted in Each
3. Psychological Triggers Used
4. Tone and Voice Analysis
5. Call-to-Action Recommendations

Format the response in a clear, structured way using markdown, with the copy versions appearing first.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a Marketing Copy Expert specializing in customer-focused messaging. You are known for creating compelling, concise copy that resonates with specific target audiences.' 
        },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate copy'
    });
  }
}); 