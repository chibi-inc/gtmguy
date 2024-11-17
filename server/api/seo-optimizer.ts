import OpenAI from 'openai'
import { fetchPageContent } from '../utils/pageFetcher'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const openai = new OpenAI({
    apiKey: config.openaiApiKey
  })

  const { url } = await readBody(event)
  
  // Fetch the actual page content
  const pageContent = await fetchPageContent(url)

  const prompt = `As an SEO expert, analyze this URL and its content to provide comprehensive recommendations:

URL: ${url}

Current Page Content:
${pageContent ? pageContent.substring(0, 2000) + '...' : 'Unable to fetch page content'}

Please analyze the current implementation and provide detailed recommendations in these areas:

1. Title Tag & Meta Description
   - Current implementation
   - Recommended improvements
   - Best practices and character limits

2. Content Structure
   - Current heading hierarchy (H1, H2, H3)
   - Content organization analysis
   - Keyword placement opportunities

3. Technical SEO
   - URL structure analysis
   - Mobile responsiveness check
   - Page speed considerations
   - Schema markup suggestions

4. Content Optimization
   - Primary keyword analysis
   - Secondary keyword suggestions
   - Content gaps identified
   - Word count recommendations

5. User Experience
   - Readability assessment
   - Content formatting analysis
   - Mobile optimization suggestions

6. Internal Linking
   - Current structure analysis
   - Anchor text recommendations
   - Navigation improvement suggestions

7. Multimedia Optimization
   - Current image implementation
   - Alt text analysis
   - Media placement strategy

8. Featured Snippet Optimization
   - Current snippet eligibility
   - Content structuring recommendations
   - Q&A content suggestions

9. Current Status vs Improvements
   Please create a detailed comparison table that includes:
   - Current title tag vs optimized title tag
   - Current meta description vs optimized version
   - Current H1 vs recommended H1
   - Existing keywords vs recommended target keywords
   - Current content length vs recommended length
   - Current URL structure vs optimized URL structure
   - Existing image alt texts vs optimized versions
   - Current internal linking status vs recommended structure

Format the response in clear sections using markdown, with actionable steps for each area. For each recommendation, include the current implementation and the specific suggested improvement.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert SEO consultant with deep knowledge of search engine optimization and content strategy.' 
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
      message: error?.message || 'Failed to generate SEO recommendations'
    })
  }
}) 