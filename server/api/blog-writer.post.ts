import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  });

  const { topic, context, keywords, useAiImages } = await readBody(event);

  const prompt = `Write a comprehensive, SEO-optimized blog post about "${topic}".

Context and Audience: ${context}
Target Keywords: ${keywords}

The blog post should:
- Be around 2500 words
- Include a compelling introduction
- Have clear, well-structured sections with headers
- Include actionable insights and takeaways
- Be optimized for SEO with proper heading hierarchy and naturally incorporate the target keywords
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

    let content = completion.choices[0].message.content || '';
    
    if (useAiImages) {
      // Get image keywords from the blog content
      const imagePromptCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert at analyzing text and extracting key visual concepts. Return only 1-2 specific image descriptions that would best illustrate this blog post separated by "|". Do not include any text in the image.'
          },
          { 
            role: 'user', 
            content: `Analyze this blog post and suggest specific, simple image prompts:\n\n${content} The image should be a simple image, without any complex elements like too many colors, or too much detail. Do not include any text in the image.` 
          }
        ],
      });

      const imagePrompts = imagePromptCompletion.choices[0].message.content?.split('|') || [];
      console.log(imagePrompts);

      const imagePromises = imagePrompts.map(prompt => 
        openai.images.generate({
          model: "dall-e-3",
          prompt: `Create clean, professional images with the following concept: ${prompt.trim()}. 

          CRITICAL REQUIREMENTS - READ CAREFULLY:
          - DO NOT ADD ANY TEXT IN THE IMAGE.
          - If text is required:
            * Spell each word EXACTLY as provided, letter by letter
            * Keep text minimal - prefer 2-3 words maximum
            * Use plain Arial or Helvetica font only
            * Make text large and centered
            * Use black text on light backgrounds only
            * Ensure 100% of each letter is clearly visible
          
          Style Requirements:
          - Create a minimalist, corporate-style image
          - Use ample white/negative space
          - Avoid complex details or busy backgrounds
          - Use simple, clean color schemes
          
          If there is ANY doubt about text spelling or clarity, DO NOT include text in the image.`,
          quality: "hd",
          n: 1,
        })
      );

      const imageResults = await Promise.all(imagePromises);
      
      const imageMarkdown = `\n\n# Image Suggestions\n\n${imageResults
        .map((result, index) => `![${imagePrompts[index].trim()}](${result.data[0].url})`)
        .join('\n\n')}`;
      
      content = content + imageMarkdown;
    }

    return content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate blog post'
    });
  }
}); 