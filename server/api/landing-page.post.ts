import OpenAI from 'openai'
import { fetchPageContent } from '../utils/pageFetcher'
import { consumeCredit } from '../utils/consumeCredit'

export default defineEventHandler(async (event) => {
  // Authenticate + spend a credit before doing any paid work.
  await consumeCredit(event)

  const config = useRuntimeConfig()
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  })

  const { url } = await readBody(event)
  
  // Fetch the actual page content
  const pageContent = await fetchPageContent(url)

  const prompt = `As a landing page optimization expert, analyze this URL and its content to provide comprehensive recommendations:

URL: ${url}

Current Page Content:
${pageContent ? pageContent.substring(0, 2000) + '...' : 'Unable to fetch page content'}

First, analyze the current state of:
- Current value proposition and main message
- Existing page structure and layout
- Current CTAs and their placement
- Existing trust elements and social proof
- Current visual design and hierarchy

Then, provide detailed recommendations for improvement in these areas:
1. Value Proposition & Messaging
   - Analysis of current main message
   - Specific copy improvements for headlines and subheadlines
   - Recommendations for clearer value communication
   
2. Page Structure & Flow
   - Current layout analysis
   - Key sections to add or reorganize
   - Recommended above-the-fold content
   - User flow optimization

3. Call-to-Action (CTA) Optimization
   - Current CTA analysis
   - Specific button copy improvements
   - Optimal placement recommendations
   - Secondary CTA suggestions

4. Trust Building Elements
   - Current social proof analysis
   - Additional trust indicators needed
   - Testimonial placement strategy
   - Credibility enhancement suggestions

5. Visual Design Enhancements
   - Current design analysis
   - Color scheme improvements
   - Typography recommendations
   - Visual hierarchy adjustments
   - Mobile-specific design changes

For each recommendation, provide:
- The current implementation
- The specific improvement needed
- Expected impact on conversion
- Implementation priority (High/Medium/Low)

Format the response in clear sections using markdown, with concrete examples and actionable steps for each area.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert landing page optimization consultant with deep knowledge of conversion rate optimization (CRO).' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ]
    })

    return completion.choices[0].message.content

  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    throw createError({
      statusCode: 500,
      message: error?.message || 'Failed to generate landing page optimization guide'
    })
  }
}) 