import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { businessGoal, keyActivities, timeFrame } = await readBody(event);

  const prompt = `As a Business Analytics expert, create a comprehensive metrics and KPI framework based on the following information:

Business Goal: ${businessGoal}
Key Activities: ${keyActivities}
Time Frame: ${timeFrame}

Please provide a detailed metrics framework including:
1. Key Performance Indicators (KPIs)
2. Leading Indicators
3. Lagging Indicators
4. Measurement Methodology
5. Target Values
6. Data Collection Strategy
7. Reporting Framework
8. Success Criteria

Format the response in a clear, structured way using markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a Business Analytics expert specializing in metrics and KPIs.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate Metrics Framework'
    });
  }
}); 