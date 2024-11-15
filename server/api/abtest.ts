import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { hypothesis, variantDetails, targetMarket } = await readBody(event);

  const prompt = `As an A/B Testing expert, create a comprehensive test plan based on the following information:

Hypothesis: ${hypothesis}
Variant Details: ${variantDetails}
Target Market: ${targetMarket}

Please provide a detailed A/B test plan including:
1. Test Objectives
2. Success Metrics
3. Test Duration
4. Sample Size Calculation
5. Implementation Plan
6. Risk Assessment
7. Monitoring Strategy
8. Analysis Framework

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