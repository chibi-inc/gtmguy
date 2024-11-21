import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { goal, productDetails } = await readBody(event);

  const prompt = `As an A/B Testing expert for SaaS, create a comprehensive test plan based on the following information:

Goal: ${goal}
Product Details: ${productDetails}

Please provide a detailed A/B test plan including:
1. Hypothesis
2. Test Variables & Variants
3. Success Metrics
4. Test Duration
5. Sample Size Requirements
6. Implementation Plan
7. Analysis Framework

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an A/B Testing expert specializing in experiment design.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate A/B Test Plan'
    });
  }
}); 