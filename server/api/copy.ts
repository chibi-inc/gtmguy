import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { productDetails, targetCustomer } = await readBody(event);

  const prompt = `As a Landing Page Copywriting Expert, create compelling copy sections for this product's landing page:

Product Details: ${productDetails}
Target Customer: ${targetCustomer}

Generate the following landing page sections:
1. Headline (max 10 words, attention-grabbing)
2. Sub-headline (1 sentence, supports main headline)
3. Hero Section Copy (2-3 sentences, main value proposition)
4. Feature Highlights (3 key features with brief benefit statements)
5. Social Proof Section (suggested testimonial angle + trust indicators)
6. Call-to-Action Phrases (3 variations)

Writing Guidelines:
- Use clear, benefit-driven language
- Maintain consistent voice and tone for the target audience
- Focus on solving customer pain points
- Include power words and emotional triggers
- Keep copy scannable and web-friendly

Please provide:
1. All copy sections (clearly labeled)
2. Tone and Voice Analysis
3. Primary Keywords Used
4. Key Emotional Triggers
5. A/B Testing Recommendations

Format the response in markdown, with the copy sections appearing first.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a Landing Page Copywriting Expert who specializes in conversion-focused web copy. You excel at creating compelling headlines, clear value propositions, and persuasive calls-to-action that drive results.' 
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