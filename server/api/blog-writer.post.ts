import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { topic, context, audience } = await readBody(event);

  const prompt = `Write a comprehensive, SEO-optimized blog post about "${topic}".

Context: ${context}
Target Audience: ${audience}

The blog post should:
- Be around 1200 words
- Include a compelling introduction
- Have clear, well-structured sections with headers
- Include actionable insights and takeaways
- Be optimized for SEO with proper heading hierarchy
- Use a tone appropriate for the context and audience
- Include a strong conclusion
- Sound human and engaging

Format the response in Markdown using # for h1, ## for h2, etc.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert blog writer and SEO specialist who writes in clean Markdown format.' },
        { role: 'user', content: prompt }
      ],
    });

    return completion.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate blog post'
    });
  }
}); 