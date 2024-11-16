import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { businessGoal, timeFrame } = await readBody(event);

  const prompt = `As a Business Analytics expert, create a comprehensive metrics and KPI framework based on the following information:

Primary Business Goal: ${businessGoal}
Time Frame: ${timeFrame}

Please provide a detailed metrics framework including:
1. Key Performance Indicators (KPIs)
   - Primary KPIs directly tied to the goal
   - Secondary supporting KPIs
   - Leading indicators
   - Lagging indicators

2. Measurement Methodology
   - Data collection points
   - Calculation methods
   - Frequency of measurement
   - Baseline metrics

3. Target Values
   - Milestone targets
   - Final targets
   - Industry benchmarks

4. Tracking Framework
   - Reporting cadence
   - Review process
   - Stakeholder communication
   - Course correction triggers

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